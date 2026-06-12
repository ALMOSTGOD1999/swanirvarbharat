import type { HttpContext } from '@adonisjs/core/http'
import {
  seriesIndexValidator,
  createSeriesValidator,
  updateSeriesValidator,
  seriesPostValidator,
  reorderSeriesPostsValidator,
} from '#validators/series'
import Series from '#models/series'
import User from '#models/user'
import Taxonomy from '#models/taxonomy'
import db from '@adonisjs/lucid/services/db'
import SeriesTransformer from '#transformers/series_transformer'
import ThumbnailService from '#services/thumbnail_service'
import { cuid } from '#utils/id'

const ALLOWED_SORT_COLUMNS = ['name', 'createdAt', 'updatedAt', 'sortOrder'] as const
const DEFAULT_SORT_COLUMN = 'createdAt'
const DEFAULT_SORT_ORDER = 'desc' as const

export default class SeriesController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.with('SeriesPolicy').authorize('viewList')
    const {
      page = 1,
      limit = 10,
      q = '',
      states = [],
      ownerIds = [],
      taxonomyNames = [],
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
    } = await seriesIndexValidator.validate(request.qs())

    const seriesQuery = Series.query()

    if (q) {
      seriesQuery.whereILike('name', `%${q}%`)
    }

    if (states.length > 0) {
      seriesQuery.whereIn('state', states)
    }

    if (ownerIds.length > 0) {
      seriesQuery.whereIn('ownerId', ownerIds)
    }

    if (taxonomyNames.length > 0) {
      seriesQuery.whereHas('taxonomies', (subQuery) =>
        subQuery.whereIn('taxonomies.name', taxonomyNames)
      )
    }

    if (dateFrom) {
      seriesQuery.where('createdAt', '>=', dateFrom)
    }

    if (dateTo) {
      seriesQuery.where('createdAt', '<=', dateTo)
    }

    const sortColumn = ALLOWED_SORT_COLUMNS.includes(sortBy as any) ? sortBy! : DEFAULT_SORT_COLUMN
    const sortDirection = sortOrder ?? DEFAULT_SORT_ORDER

    const paginatedSeries = await seriesQuery
      .preload('owner')
      .preload('asset')
      .preload('taxonomies')
      .withCount('posts')
      .orderBy(sortColumn, sortDirection)
      .paginate(page, limit)

    paginatedSeries.queryString(request.qs())

    const allOwners = await User.query()
      .select(['id', 'username', 'email'])
      .preload('profile')
      .orderBy('username')

    return inertia.render('admin/series/index', {
      series: SeriesTransformer.paginate(paginatedSeries.all(), paginatedSeries.getMeta()),
      q,
      states,
      ownerIds,
      taxonomyNames,
      dateFrom: dateFrom ?? '',
      dateTo: dateTo ?? '',
      sortBy: sortBy ?? 'createdAt',
      sortOrder: sortOrder ?? 'desc',
      allOwners: allOwners.map((u) => ({
        id: u.id,
        name: u.profile?.name || u.username || u.email,
      })),
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.with('SeriesPolicy').authorize('create')
    const taxonomies = await Taxonomy.query().select('id', 'name').orderBy('name')

    return inertia.render('admin/series/form', {
      taxonomies: taxonomies.map((t) => ({ id: t.id, name: t.name })),
    })
  }

  async store({ auth, request, response, session, bouncer }: HttpContext) {
    await bouncer.with('SeriesPolicy').authorize('create')
    const {
      taxonomyIds = [],
      thumbnail,
      ...payload
    } = await request.validateUsing(createSeriesValidator)
    const user = auth.getUserOrFail()

    const trx = await db.transaction()

    try {
      const series = await Series.create(
        {
          ...payload,
          ownerId: user.id,
          description: payload.description ?? '',
        },
        { client: trx }
      )

      if (taxonomyIds.length > 0) {
        await series.related('taxonomies').sync(taxonomyIds, false)
      }

      await ThumbnailService.handleCreate(series, thumbnail, 'asset', trx)

      await trx.commit()

      session.flash('success', 'Series created successfully.')
      return response.redirect().toRoute('admin.series.edit', { id: series.id })
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Some error occurred. Your series was not created.')
      throw error
    }
  }

  async edit({ params, serialize, inertia, bouncer }: HttpContext) {
    const series = await Series.query()
      .where('id', params.id)
      .orWhere('slug', params.id)
      .preload('asset')
      .preload('taxonomies')
      .firstOrFail()
    await bouncer.with('SeriesPolicy').authorize('update', series)

    const taxonomies = await Taxonomy.query().select('id', 'name').orderBy('name')

    const s = await serialize(SeriesTransformer.transform(series))

    return inertia.render('admin/series/form', {
      series: s.data,
      taxonomies: taxonomies.map((t) => ({ id: t.id, name: t.name })),
    })
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    const {
      taxonomyIds = [],
      thumbnail,
      ...payload
    } = await request.validateUsing(updateSeriesValidator)

    const series = await Series.query().where('id', params.id).preload('asset').firstOrFail()
    await bouncer.with('SeriesPolicy').authorize('update', series)

    const trx = await db.transaction()

    try {
      series.useTransaction(trx)
      series.merge({
        ...payload,
        description: payload.description ?? series.description,
      })
      await series.save()

      await series.related('taxonomies').sync(taxonomyIds, false)
      await ThumbnailService.handleUpdate(series, thumbnail, 'asset', trx)

      await trx.commit()

      session.flash('success', 'Series updated successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to update series.')
      throw error
    }
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    const series = await Series.query().where('id', params.id).firstOrFail()
    await bouncer.with('SeriesPolicy').authorize('delete', series)

    const trx = await db.transaction()

    try {
      // Delete series_posts pivot records
      await trx.from('series_posts').where('series_id', series.id).delete()

      // Delete series_taxonomies pivot records
      await trx.from('series_taxonomies').where('series_id', series.id).delete()

      // Delete the series itself
      await Series.query({ client: trx }).where('id', series.id).delete()

      await trx.commit()

      session.flash('success', 'Series deleted successfully.')
      return response.redirect().toRoute('admin.series.index')
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to delete series.')
      throw error
    }
  }

  // --- Post management ---

  async storePost({ params, request, response, session, bouncer }: HttpContext) {
    const series = await Series.query().where('id', params.id).firstOrFail()
    await bouncer.with('SeriesPolicy').authorize('update', series)

    const data = await request.validateUsing(seriesPostValidator)

    const trx = await db.transaction()

    try {
      // Get the next sort order
      const lastPost = await db
        .from('series_posts')
        .where('series_id', series.id)
        .orderBy('sort_order', 'desc')
        .first()

      const baseSortOrder = (lastPost?.sort_order ?? -1) + 1

      if (data.postIds && data.postIds.length > 0) {
        for (let i = 0; i < data.postIds.length; i++) {
          await trx.table('series_posts').insert({
            id: cuid(24),
            series_id: series.id,
            post_id: data.postIds[i],
            sort_order: baseSortOrder + i,
          })
        }
      }

      await trx.commit()

      session.flash('success', 'Post(s) added to series successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to add post(s) to series.')
      throw error
    }
  }

  async reorderPosts({ params, request, response, session, bouncer }: HttpContext) {
    const series = await Series.query().where('id', params.id).firstOrFail()
    await bouncer.with('SeriesPolicy').authorize('update', series)

    const { postIds } = await request.validateUsing(reorderSeriesPostsValidator)

    const trx = await db.transaction()

    try {
      for (let i = 0; i < postIds.length; i++) {
        await trx
          .from('series_posts')
          .where('series_id', series.id)
          .where('post_id', postIds[i])
          .update({ sort_order: i })
      }

      await trx.commit()

      session.flash('success', 'Post order updated successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to update post order.')
      throw error
    }
  }

  async destroyPost({ params, response, session, bouncer }: HttpContext) {
    const series = await Series.query().where('id', params.seriesId).firstOrFail()
    await bouncer.with('SeriesPolicy').authorize('update', series)

    const trx = await db.transaction()

    try {
      await trx
        .from('series_posts')
        .where('series_id', params.seriesId)
        .where('post_id', params.postId)
        .delete()

      await trx.commit()

      session.flash('success', 'Post removed from series successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to remove post from series.')
      throw error
    }
  }
}
