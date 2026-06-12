import type { HttpContext } from '@adonisjs/core/http'

import Taxonomy from '#models/taxonomy'
import TaxonomyTransformer from '#transformers/taxonomy_transformer'
import {
  createTaxonomyValidator,
  listTaxonomyValidator,
  updateTaxonomyValidator,
} from '#validators/taxonomy'
import db from '@adonisjs/lucid/services/db'
import ThumbnailService from '#services/thumbnail_service'

export default class TaxonomiesController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.with('TaxonomyPolicy').authorize('viewList')
    const {
      page = 1,
      limit = 10,
      q = '',
      types = [],
      isFeatured,
      ownerIds = [],
      dateFrom,
      dateTo,
      sortBy = 'name',
      sortOrder = 'asc',
    } = await listTaxonomyValidator.validate(request.qs())

    const taxonomiesQuery = Taxonomy.query()
      .withCount('posts')
      .withCount('children')
      .preload('parent', (p) => p.select('id', 'name', 'slug'))
      .preload('owner', (o) => o.preload('profile'))

    if (q) {
      taxonomiesQuery.where((builder) => {
        builder
          .whereILike('name', `%${q}%`)
          .orWhereILike('description', `%${q}%`)
          .orWhereILike('slug', `%${q}%`)
          .orWhereILike('pageTitle', `%${q}%`)
          .orWhereILike('metaDescription', `%${q}%`)
      })
    }

    if (types.length > 0) {
      taxonomiesQuery.whereIn('type', types)
    }

    if (isFeatured !== undefined) {
      taxonomiesQuery.where('isFeatured', isFeatured)
    }

    if (ownerIds.length > 0) {
      taxonomiesQuery.whereIn('ownerId', ownerIds)
    }

    if (dateFrom) {
      taxonomiesQuery.where('createdAt', '>=', dateFrom)
    }

    if (dateTo) {
      taxonomiesQuery.where('createdAt', '<=', dateTo)
    }

    const ALLOWED_SORT_COLUMNS = ['name', 'createdAt', 'updatedAt']
    const sortColumn = ALLOWED_SORT_COLUMNS.includes(sortBy) ? sortBy : 'name'
    const sortDirection = sortOrder === 'desc' ? 'desc' : 'asc'
    taxonomiesQuery.orderBy(sortColumn, sortDirection)

    const paginatedTaxonomies = await taxonomiesQuery.paginate(page, limit)

    // Fetch filter options
    const allOwners = await Taxonomy.query()
      .distinct('ownerId')
      .whereNotNull('ownerId')
      .preload('owner', (o) => o.preload('profile'))
      .then((rows) =>
        rows
          .map((r) => r.owner)
          .filter(Boolean)
          .map((u) => ({ id: u!.id, name: u!.profile?.name || u!.username }))
      )

    return inertia.render('admin/taxonomies/index', {
      taxonomies: TaxonomyTransformer.paginate(
        paginatedTaxonomies.all(),
        paginatedTaxonomies.getMeta()
      ),
      q,
      types,
      isFeatured,
      ownerIds,
      dateFrom: dateFrom ?? '',
      dateTo: dateTo ?? '',
      sortBy: sortBy ?? 'name',
      sortOrder: sortOrder ?? 'asc',
      allOwners,
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.with('TaxonomyPolicy').authorize('create')
    return inertia.render('admin/taxonomies/form', {})
  }

  async store({ auth, request, response, session, bouncer }: HttpContext) {
    try {
      await bouncer.with('TaxonomyPolicy').authorize('create')
      const { thumbnail, ...payload } = await request.validateUsing(createTaxonomyValidator)
      const user = auth.getUserOrFail()

      const trx = await db.transaction()
      try {
        const taxonomy = await Taxonomy.create(
          {
            ...payload,
            ownerId: user.id,
            description: payload.description ?? '',
            pageTitle: payload.pageTitle ?? '',
            metaDescription: payload.metaDescription ?? '',
          },
          { client: trx }
        )

        await ThumbnailService.handleCreate(taxonomy, thumbnail, 'asset', trx)
        await trx.commit()

        session.flash('success', 'Taxonomy created successfully.')
        return response.redirect().toRoute('admin.taxonomies.index')
      } catch (error) {
        await trx.rollback()
        throw error
      }
    } catch (error) {
      session.flash('error', 'Failed to create taxonomy.')
      return response.redirect().back()
    }
  }

  async edit({ params, inertia, bouncer }: HttpContext) {
    const taxonomy = await Taxonomy.query()
      .where('id', params.id)
      .orWhere('slug', params.id)
      .preload('asset')
      .firstOrFail()
    await bouncer.with('TaxonomyPolicy').authorize('update', taxonomy)

    return inertia.render('admin/taxonomies/form', {
      taxonomy: TaxonomyTransformer.transform(taxonomy),
    })
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    try {
      const taxonomy = await Taxonomy.query().where('id', params.id).preload('asset').firstOrFail()
      await bouncer.with('TaxonomyPolicy').authorize('update', taxonomy)
      const { thumbnail, ...payload } = await request.validateUsing(updateTaxonomyValidator, {
        meta: { id: taxonomy.id },
      })

      const trx = await db.transaction()
      try {
        taxonomy.useTransaction(trx)
        await taxonomy
          .merge({
            ...payload,
            description: payload.description ?? '',
            pageTitle: payload.pageTitle ?? '',
            metaDescription: payload.metaDescription ?? '',
          })
          .save()

        await ThumbnailService.handleUpdate(taxonomy, thumbnail, 'asset', trx)
        await trx.commit()

        session.flash('success', 'Taxonomy updated successfully.')
        return response.redirect().back()
      } catch (error) {
        await trx.rollback()
        throw error
      }
    } catch (error) {
      session.flash('error', 'Failed to update taxonomy.')
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    try {
      const taxonomy = await Taxonomy.findOrFail(params.id)
      await bouncer.with('TaxonomyPolicy').authorize('delete')

      // Get all child IDs for cascade cleanup
      const children = await taxonomy.related('children').query().select('id')
      const cascadeIds = [...children.map((c) => c.id), taxonomy.id]

      await db.transaction(async (trx) => {
        // Clean up pivot tables
        await trx.from('post_taxonomies').whereIn('taxonomy_id', cascadeIds).delete()

        // Delete children first, then the taxonomy itself
        await taxonomy.related('children').query().delete()
        await taxonomy.delete()
      })

      session.flash('success', 'Taxonomy deleted successfully')
      return response.redirect().toRoute('admin.taxonomies.index')
    } catch (error) {
      session.flash('error', 'Failed to delete taxonomy.')
      return response.redirect().back()
    }
  }

  async apiIndex({ response }: HttpContext) {
    const taxonomies = await Taxonomy.query()
      .select('name')
      .min('id as id')
      .count('* as count')
      .groupBy('name')
      .orderBy('name')
    const uniqueTaxonomies = taxonomies.map((t) => ({
      id: t.$extras.id,
      name: t.name,
      count: Number(t.$extras.count),
    }))
    return response.ok(uniqueTaxonomies)
  }
}
