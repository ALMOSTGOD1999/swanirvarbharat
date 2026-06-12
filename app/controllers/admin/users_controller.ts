import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import Role from '#models/role'
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

  async destroy({ params, response, session, bouncer }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      await bouncer.with('UserPolicy').authorize('delete', user)
      await user.delete()

      session.flash('success', 'User deleted successfully')
      return response.redirect().toRoute('admin.users.index')
    } catch (error) {
      session.flash('error', 'Failed to delete user.')
      return response.redirect().back()
    }
  }
}
