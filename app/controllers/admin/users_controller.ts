import type { HttpContext } from '@adonisjs/core/http'

import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import { unlinkSync, existsSync } from 'node:fs'
import { join, basename } from 'node:path'
import { attachmentManager } from '@jrmc/adonis-attachment'

import User from '#models/user'
import Role from '#models/role'
import CandidateApplication from '#models/candidate_application'
import UserTransformer from '#transformers/user_transformer'
import { userIndexValidator, userRoleValidator } from '#validators/user'

export default class UsersController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.with('UserPolicy').authorize('viewList')
    const {
      page = 1,
      limit = 10,
      q = '',
      roleIds = [],
      emailVerified,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = await userIndexValidator.validate(request.qs())

    const usersQuery = User.query().preload('role')

    if (q) {
      usersQuery.where((builder) => {
        builder.whereILike('username', `%${q}%`).orWhereILike('email', `%${q}%`)
      })
    }

    if (roleIds.length > 0) {
      usersQuery.whereIn('roleId', roleIds)
    }

    if (emailVerified !== undefined) {
      if (emailVerified) {
        usersQuery.whereNotNull('emailVerifiedAt')
      } else {
        usersQuery.whereNull('emailVerifiedAt')
      }
    }

    if (dateFrom) {
      usersQuery.where('createdAt', '>=', dateFrom)
    }

    if (dateTo) {
      usersQuery.where('createdAt', '<=', dateTo)
    }

    const ALLOWED_SORT_COLUMNS = ['username', 'email', 'createdAt', 'updatedAt']
    const sortColumn = ALLOWED_SORT_COLUMNS.includes(sortBy) ? sortBy : 'createdAt'
    const sortDirection = sortOrder === 'asc' ? 'asc' : 'desc'
    usersQuery.orderBy(sortColumn, sortDirection)

    const paginatedUsers = await usersQuery.paginate(page, limit)

    // Fetch all roles for filter dropdown
    const allRoles = await Role.query().select('id', 'name')

    return inertia.render('admin/users/index', {
      users: UserTransformer.paginate(paginatedUsers.all(), paginatedUsers.getMeta()),
      q,
      roleIds,
      emailVerified,
      dateFrom: dateFrom ?? '',
      dateTo: dateTo ?? '',
      sortBy: sortBy ?? 'createdAt',
      sortOrder: sortOrder ?? 'desc',
      allRoles: allRoles.map((r) => ({ id: r.id, name: r.name })),
    })
  }

  async show({ params, inertia, bouncer }: HttpContext) {
    const user = await User.query()
      .where('id', params.id)
      .preload('role')
      .preload('profile')
      .firstOrFail()
    await bouncer.with('UserPolicy').authorize('view', user)

    // const roles = await Role.query().orderBy('id')

    return inertia.render('admin/users/show', {
      user: UserTransformer.transform(user),
      // roles: roles.map((r) => ({ id: r.id, name: r.name })),
    })
  }

  async role({ params, request, response, session, bouncer }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      await bouncer.with('UserPolicy').authorize('update', user)
      const data = await request.validateUsing(userRoleValidator)

      await user.merge({ roleId: data.roleId }).save()

      session.flash('success', 'User role updated successfully')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', 'Failed to update user role.')
      return response.redirect().back()
    }
  }

  async destroy({ params, request, response, session, bouncer }: HttpContext) {
    const masterKey = request.input('masterKey')

    if (masterKey !== 'reallydelete') {
      session.flash('error', 'Invalid master key. User deletion cancelled.')
      return response.redirect().back()
    }

    const trx = await db.transaction()

    try {
      const user = await User.findOrFail(params.id)
      await bouncer.with('UserPolicy').authorize('delete', user)

      // Collect candidate application file references for disk cleanup
      const candidateApplications = await CandidateApplication.query()
        .where('userId', user.id)
        .exec()

      const fileColumns: (keyof CandidateApplication)[] = [
        'certificate10th',
        'certificate12th',
        'certificateGraduation',
        'certificatePostGraduation',
        'passportPhoto',
        'introductionVideo',
        'purposeVideo',
        'kycDocument',
      ]

      const uploadDir = app.publicPath('uploads')
      const candidateFiles: string[] = []
      for (const application of candidateApplications) {
        for (const column of fileColumns) {
          const ref = application[column] as { url?: string } | null
          if (ref && ref.url) {
            candidateFiles.push(join(uploadDir, basename(ref.url)))
          }
        }
      }

      // Capture avatar before deletion (it's a managed Attachment)
      const avatar = user.avatar

      // Delete candidate application rows
      await trx.from('candidate_applications').where('user_id', user.id).delete()

      // Delete all related records by user id
      await trx.from('session_logs').where('user_id', user.id).delete()
      await trx.from('comments').where('user_id', user.id).delete()
      await trx.from('discussions').where('user_id', user.id).delete()
      await trx.from('comment_votes').where('user_id', user.id).delete()
      await trx.from('discussion_votes').where('user_id', user.id).delete()
      await trx.from('author_posts').where('user_id', user.id).delete()
      await trx.from('progress').where('user_id', user.id).delete()
      await trx.from('histories').where('user_id', user.id).delete()
      await trx.from('assessment_results').where('user_id', user.id).delete()
      await trx.from('notifications').where('user_id', user.id).delete()
      await trx.from('blocks').where('user_id', user.id).delete()
      await trx.from('email_histories').where('user_id', user.id).delete()
      await trx.from('lesson_requests').where('user_id', user.id).delete()
      await trx.from('request_votes').where('user_id', user.id).delete()
      await trx.from('question_votes').where('user_id', user.id).delete()
      await trx.from('questions').where('user_id', user.id).delete()
      await trx.from('discussion_views').where('user_id', user.id).delete()
      await trx.from('topics').where('user_id', user.id).delete()
      await trx.from('member_enrollments').where('user_id', user.id).delete()
      await trx.from('member_enrollment_events').where('user_id', user.id).delete()

      // Delete profile (linked by foreignKey: 'id', localKey: 'id')
      await trx.from('profiles').where('id', user.id).delete()

      // Delete the user within the transaction
      user.useTransaction(trx)
      await user.delete()

      await trx.commit()

      // Cleanup candidate application files from disk
      for (const filePath of candidateFiles) {
        try {
          if (existsSync(filePath)) {
            unlinkSync(filePath)
          }
        } catch {
          // Ignore errors for individual file cleanup
        }
      }

      // Cleanup avatar file from disk via the attachment manager
      if (avatar) {
        try {
          await attachmentManager.remove(avatar)
        } catch {
          // Ignore avatar cleanup errors (avatar may not exist on disk)
        }
      }

      session.flash('success', 'User and all associated data deleted successfully.')
      return response.redirect().toRoute('admin.users.index')
    } catch (error) {
      await trx.rollback()
      const message = error instanceof Error ? error.message : String(error)
      session.flash('error', `Failed to delete user: ${message}`)
      return response.redirect().back()
    }
  }
}
