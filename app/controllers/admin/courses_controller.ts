import type { HttpContext } from '@adonisjs/core/http'
import {
  courseIndexValidator,
  createCourseValidator,
  updateCourseValidator,
  courseModuleValidator,
  courseModuleContentValidator,
  reorderCourseModulesValidator,
} from '#validators/course'
import Course from '#models/course'
import CourseModule from '#models/course_module'
import User from '#models/user'
import Taxonomy from '#models/taxonomy'
import AccessLevel from '#models/access_level'
import db from '@adonisjs/lucid/services/db'
import CourseTransformer from '#transformers/course_transformer'
import ThumbnailService from '#services/thumbnail_service'

const ALLOWED_SORT_COLUMNS = ['name', 'createdAt', 'updatedAt', 'sortOrder'] as const
const DEFAULT_SORT_COLUMN = 'createdAt'
const DEFAULT_SORT_ORDER = 'desc' as const

export default class CoursesController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.with('CoursePolicy').authorize('viewList')
    const {
      page = 1,
      limit = 10,
      q = '',
      states = [],
      difficulties = [],
      ownerIds = [],
      taxonomyNames = [],
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
    } = await courseIndexValidator.validate(request.qs())

    const coursesQuery = Course.query()

    if (q) {
      coursesQuery.whereILike('name', `%${q}%`)
    }

    if (states.length > 0) {
      coursesQuery.whereIn('state', states)
    }

    if (difficulties.length > 0) {
      coursesQuery.whereIn('difficulty', difficulties)
    }

    if (ownerIds.length > 0) {
      coursesQuery.whereIn('ownerId', ownerIds)
    }

    if (taxonomyNames.length > 0) {
      coursesQuery.whereHas('taxonomies', (subQuery) =>
        subQuery.whereIn('taxonomies.name', taxonomyNames)
      )
    }

    if (dateFrom) {
      coursesQuery.where('createdAt', '>=', dateFrom)
    }

    if (dateTo) {
      coursesQuery.where('createdAt', '<=', dateTo)
    }

    const sortColumn = ALLOWED_SORT_COLUMNS.includes(sortBy as any) ? sortBy! : DEFAULT_SORT_COLUMN
    const sortDirection = sortOrder ?? DEFAULT_SORT_ORDER

    const paginatedCourses = await coursesQuery
      .preload('owner')
      .preload('asset')
      .preload('accessLevel')
      .preload('taxonomies')
      .withCount('modules')
      .orderBy(sortColumn, sortDirection)
      .paginate(page, limit)

    paginatedCourses.queryString(request.qs())

    const allOwners = await User.query()
      .select(['id', 'username', 'email'])
      .preload('profile')
      .orderBy('username')

    return inertia.render('admin/courses/index', {
      courses: CourseTransformer.paginate(paginatedCourses.all(), paginatedCourses.getMeta()),
      q,
      states,
      difficulties,
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
    await bouncer.with('CoursePolicy').authorize('create')
    const taxonomies = await Taxonomy.query().select('id', 'name').orderBy('name')
    const accessLevels = await AccessLevel.query().orderBy('sortOrder')

    return inertia.render('admin/courses/form', {
      taxonomies: taxonomies.map((t) => ({ id: t.id, name: t.name })),
      accessLevels: accessLevels.map((al) => ({
        id: al.id,
        name: al.name,
        color: al.color,
      })),
    })
  }

  async store({ auth, request, response, session, bouncer }: HttpContext) {
    await bouncer.with('CoursePolicy').authorize('create')
    const {
      taxonomyIds = [],
      thumbnail,
      ...payload
    } = await request.validateUsing(createCourseValidator)
    const user = auth.getUserOrFail()

    const trx = await db.transaction()

    try {
      const course = await Course.create(
        {
          ...payload,
          ownerId: user.id,
          description: payload.description ?? '',
          pageTitle: payload.pageTitle ?? '',
          metaDescription: payload.metaDescription ?? '',
        },
        { client: trx }
      )

      if (taxonomyIds.length > 0) {
        await course.related('taxonomies').sync(taxonomyIds, false)
      }

      await ThumbnailService.handleCreate(course, thumbnail, 'asset', trx)

      await trx.commit()

      session.flash('success', 'Course created successfully.')
      return response.redirect().toRoute('admin.courses.edit', { id: course.id })
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Some error occurred. Your course was not created.')
      throw error
    }
  }

  async edit({ params, serialize, inertia, bouncer }: HttpContext) {
    const course = await Course.query()
      .where('id', params.id)
      .orWhere('slug', params.id)
      .preload('asset')
      .preload('accessLevel')
      .preload('taxonomies')
      .firstOrFail()
    await bouncer.with('CoursePolicy').authorize('update', course)

    const taxonomies = await Taxonomy.query().select('id', 'name').orderBy('name')
    const accessLevels = await AccessLevel.query().orderBy('sortOrder')

    const c = await serialize(CourseTransformer.transform(course))

    return inertia.render('admin/courses/form', {
      course: c.data,
      taxonomies: taxonomies.map((t) => ({ id: t.id, name: t.name })),
      accessLevels: accessLevels.map((al) => ({
        id: al.id,
        name: al.name,
        color: al.color,
      })),
    })
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    const {
      taxonomyIds = [],
      thumbnail,
      ...payload
    } = await request.validateUsing(updateCourseValidator)

    const course = await Course.query().where('id', params.id).preload('asset').firstOrFail()
    await bouncer.with('CoursePolicy').authorize('update', course)

    const trx = await db.transaction()

    try {
      course.useTransaction(trx)
      course.merge({
        ...payload,
        description: payload.description ?? course.description,
        pageTitle: payload.pageTitle ?? course.pageTitle,
        metaDescription: payload.metaDescription ?? course.metaDescription,
      })
      await course.save()

      await course.related('taxonomies').sync(taxonomyIds, false)
      await ThumbnailService.handleUpdate(course, thumbnail, 'asset', trx)

      await trx.commit()

      session.flash('success', 'Course updated successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to update course.')
      throw error
    }
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    const course = await Course.query().where('id', params.id).firstOrFail()
    await bouncer.with('CoursePolicy').authorize('delete', course)

    const trx = await db.transaction()

    try {
      // Delete course_module_posts pivot records for all modules in this course
      const moduleIds = await CourseModule.query({ client: trx })
        .where('courseId', course.id)
        .select('id')

      for (const mod of moduleIds) {
        await trx.from('course_module_posts').where('course_module_id', mod.id).delete()
      }

      // Delete course_modules
      await CourseModule.query({ client: trx }).where('courseId', course.id).delete()

      // Delete course_taxonomies pivot records
      await trx.from('course_taxonomies').where('course_id', course.id).delete()

      // Delete the course itself
      await Course.query({ client: trx }).where('id', course.id).delete()

      await trx.commit()

      session.flash('success', 'Course deleted successfully.')
      return response.redirect().toRoute('admin.courses.index')
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to delete course.')
      throw error
    }
  }

  // --- Module management ---

  async storeModule({ params, request, response, session, bouncer }: HttpContext) {
    const course = await Course.query().where('id', params.id).firstOrFail()
    await bouncer.with('CoursePolicy').authorize('update', course)

    const data = await request.validateUsing(courseModuleValidator)

    const trx = await db.transaction()

    try {
      // Get the next sort order
      const lastModule = await CourseModule.query({ client: trx })
        .where('courseId', course.id)
        .orderBy('sortOrder', 'desc')
        .first()

      await CourseModule.create(
        {
          courseId: course.id,
          name: data.name,
          notes: data.notes ?? null,
          state: data.state ?? 'Draft',
          sortOrder: (lastModule?.sortOrder ?? -1) + 1,
        },
        { client: trx }
      )

      await trx.commit()

      session.flash('success', 'Module added successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to add module.')
      throw error
    }
  }

  async updateModule({ params, request, response, session, bouncer }: HttpContext) {
    const course = await Course.query().where('id', params.courseId).firstOrFail()
    await bouncer.with('CoursePolicy').authorize('update', course)

    const module = await CourseModule.query()
      .where('id', params.moduleId)
      .where('courseId', params.courseId)
      .firstOrFail()

    const data = await request.validateUsing(courseModuleValidator)

    const trx = await db.transaction()

    try {
      module.useTransaction(trx)
      module.merge({
        name: data.name,
        notes: data.notes ?? module.notes,
        state: data.state ?? module.state,
      })
      await module.save()

      await trx.commit()

      session.flash('success', 'Module updated successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to update module.')
      throw error
    }
  }

  async destroyModule({ params, response, session, bouncer }: HttpContext) {
    const course = await Course.query().where('id', params.courseId).firstOrFail()
    await bouncer.with('CoursePolicy').authorize('update', course)

    const trx = await db.transaction()

    try {
      // Delete module posts pivot
      await trx.from('course_module_posts').where('course_module_id', params.moduleId).delete()

      // Delete module
      await CourseModule.query({ client: trx })
        .where('id', params.moduleId)
        .where('courseId', params.courseId)
        .delete()

      await trx.commit()

      session.flash('success', 'Module deleted successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to delete module.')
      throw error
    }
  }

  async updateModuleContent({ params, request, response, session, bouncer }: HttpContext) {
    const course = await Course.query().where('id', params.courseId).firstOrFail()
    await bouncer.with('CoursePolicy').authorize('update', course)

    const module = await CourseModule.query()
      .where('id', params.moduleId)
      .where('courseId', params.courseId)
      .firstOrFail()

    const { postIds = [] } = await request.validateUsing(courseModuleContentValidator)

    const trx = await db.transaction()

    try {
      // Clear existing module posts
      await trx.from('course_module_posts').where('course_module_id', module.id).delete()

      // Sync posts
      for (let i = 0; i < postIds.length; i++) {
        await trx.table('course_module_posts').insert({
          id: (await import('#utils/id')).cuid(24),
          course_module_id: module.id,
          post_id: postIds[i],
          sort_order: i,
        })
      }

      await trx.commit()

      session.flash('success', 'Module content updated successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to update module content.')
      throw error
    }
  }

  async reorderModules({ params, request, response, session, bouncer }: HttpContext) {
    const course = await Course.query().where('id', params.id).firstOrFail()
    await bouncer.with('CoursePolicy').authorize('update', course)

    const { moduleIds } = await request.validateUsing(reorderCourseModulesValidator)

    const trx = await db.transaction()

    try {
      for (let i = 0; i < moduleIds.length; i++) {
        await CourseModule.query({ client: trx })
          .where('id', moduleIds[i])
          .where('courseId', course.id)
          .update({ sortOrder: i })
      }

      await trx.commit()

      session.flash('success', 'Module order updated successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to update module order.')
      throw error
    }
  }
}
