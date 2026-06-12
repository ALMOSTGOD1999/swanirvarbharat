import type { HttpContext } from '@adonisjs/core/http'
import {
  pathIndexValidator,
  createPathValidator,
  updatePathValidator,
  pathCourseValidator,
  reorderPathCoursesValidator,
} from '#validators/path'
import Path from '#models/path'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import PathTransformer from '#transformers/path_transformer'
import ThumbnailService from '#services/thumbnail_service'
import { cuid } from '#utils/id'

const ALLOWED_SORT_COLUMNS = ['name', 'createdAt', 'updatedAt'] as const
const DEFAULT_SORT_COLUMN = 'createdAt'
const DEFAULT_SORT_ORDER = 'desc' as const

export default class PathsController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.with('PathPolicy').authorize('viewList')
    const {
      page = 1,
      limit = 10,
      q = '',
      states = [],
      ownerIds = [],
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
    } = await pathIndexValidator.validate(request.qs())

    const pathsQuery = Path.query()

    if (q) {
      pathsQuery.whereILike('name', `%${q}%`)
    }

    if (states.length > 0) {
      pathsQuery.whereIn('state', states)
    }

    if (ownerIds.length > 0) {
      pathsQuery.whereIn('ownerId', ownerIds)
    }

    if (dateFrom) {
      pathsQuery.where('createdAt', '>=', dateFrom)
    }

    if (dateTo) {
      pathsQuery.where('createdAt', '<=', dateTo)
    }

    const sortColumn = ALLOWED_SORT_COLUMNS.includes(sortBy as any) ? sortBy! : DEFAULT_SORT_COLUMN
    const sortDirection = sortOrder ?? DEFAULT_SORT_ORDER

    const paginatedPaths = await pathsQuery
      .preload('owner')
      .preload('asset')
      .withCount('courses')
      .orderBy(sortColumn, sortDirection)
      .paginate(page, limit)

    paginatedPaths.queryString(request.qs())

    const allOwners = await User.query()
      .select(['id', 'username', 'email'])
      .preload('profile')
      .orderBy('username')

    return inertia.render('admin/paths/index', {
      paths: PathTransformer.paginate(paginatedPaths.all(), paginatedPaths.getMeta()),
      q,
      states,
      ownerIds,
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
    await bouncer.with('PathPolicy').authorize('create')

    return inertia.render('admin/paths/form', {})
  }

  async store({ auth, request, response, session, bouncer }: HttpContext) {
    await bouncer.with('PathPolicy').authorize('create')
    const { thumbnail, ...payload } = await request.validateUsing(createPathValidator)
    const user = auth.getUserOrFail()

    const trx = await db.transaction()

    try {
      const path = await Path.create(
        {
          ...payload,
          ownerId: user.id,
          description: payload.description ?? '',
        },
        { client: trx }
      )

      await ThumbnailService.handleCreate(path, thumbnail, 'asset', trx)

      await trx.commit()

      session.flash('success', 'Path created successfully.')
      return response.redirect().toRoute('admin.paths.edit', { id: path.id })
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Some error occurred. Your path was not created.')
      throw error
    }
  }

  async edit({ params, serialize, inertia, bouncer }: HttpContext) {
    const path = await Path.query()
      .where('id', params.id)
      .orWhere('slug', params.id)
      .preload('asset')
      .firstOrFail()
    await bouncer.with('PathPolicy').authorize('update', path)

    const p = await serialize(PathTransformer.transform(path))

    return inertia.render('admin/paths/form', {
      path: p.data,
    })
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    const { thumbnail, ...payload } = await request.validateUsing(updatePathValidator)

    const path = await Path.query().where('id', params.id).preload('asset').firstOrFail()
    await bouncer.with('PathPolicy').authorize('update', path)

    const trx = await db.transaction()

    try {
      path.useTransaction(trx)
      path.merge({
        ...payload,
        description: payload.description ?? path.description,
      })
      await path.save()

      await ThumbnailService.handleUpdate(path, thumbnail, 'asset', trx)

      await trx.commit()

      session.flash('success', 'Path updated successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to update path.')
      throw error
    }
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    const path = await Path.query().where('id', params.id).firstOrFail()
    await bouncer.with('PathPolicy').authorize('delete', path)

    const trx = await db.transaction()

    try {
      // Delete path_courses pivot records
      await trx.from('path_courses').where('path_id', path.id).delete()

      // Delete the path itself
      await Path.query({ client: trx }).where('id', path.id).delete()

      await trx.commit()

      session.flash('success', 'Path deleted successfully.')
      return response.redirect().toRoute('admin.paths.index')
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to delete path.')
      throw error
    }
  }

  // --- Course management ---

  async storeCourse({ params, request, response, session, bouncer }: HttpContext) {
    const path = await Path.query().where('id', params.id).firstOrFail()
    await bouncer.with('PathPolicy').authorize('update', path)

    const data = await request.validateUsing(pathCourseValidator)

    const trx = await db.transaction()

    try {
      // Get the next sort order
      const lastCourse = await db
        .from('path_courses')
        .where('path_id', path.id)
        .orderBy('sort_order', 'desc')
        .first()

      const baseSortOrder = (lastCourse?.sort_order ?? -1) + 1

      if (data.courseIds && data.courseIds.length > 0) {
        for (let i = 0; i < data.courseIds.length; i++) {
          await trx.table('path_courses').insert({
            id: cuid(24),
            path_id: path.id,
            course_id: data.courseIds[i],
            sort_order: baseSortOrder + i,
          })
        }
      }

      await trx.commit()

      session.flash('success', 'Course(s) added to path successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to add course(s) to path.')
      throw error
    }
  }

  async reorderCourses({ params, request, response, session, bouncer }: HttpContext) {
    const path = await Path.query().where('id', params.id).firstOrFail()
    await bouncer.with('PathPolicy').authorize('update', path)

    const { courseIds } = await request.validateUsing(reorderPathCoursesValidator)

    const trx = await db.transaction()

    try {
      for (let i = 0; i < courseIds.length; i++) {
        await trx
          .from('path_courses')
          .where('path_id', path.id)
          .where('course_id', courseIds[i])
          .update({ sort_order: i })
      }

      await trx.commit()

      session.flash('success', 'Course order updated successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to update course order.')
      throw error
    }
  }

  async destroyCourse({ params, response, session, bouncer }: HttpContext) {
    const path = await Path.query().where('id', params.pathId).firstOrFail()
    await bouncer.with('PathPolicy').authorize('update', path)

    const trx = await db.transaction()

    try {
      await trx
        .from('path_courses')
        .where('path_id', params.pathId)
        .where('course_id', params.courseId)
        .delete()

      await trx.commit()

      session.flash('success', 'Course removed from path successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to remove course from path.')
      throw error
    }
  }
}
