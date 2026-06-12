import type { HttpContext } from '@adonisjs/core/http'

import Role from '#models/role'
import RoleTransformer from '#transformers/role_transformer'
import { createRoleValidator, roleIndexValidator, updateRoleValidator } from '#validators/role'

export default class RolesController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.with('RolePolicy').authorize('viewList')
    const {
      page = 1,
      limit = 10,
      q = '',
      dateFrom,
      dateTo,
      sortBy = 'name',
      sortOrder = 'asc',
    } = await roleIndexValidator.validate(request.qs())

    const rolesQuery = Role.query().withCount('users')

    if (q) {
      rolesQuery.where((builder) => {
        builder.whereILike('name', `%${q}%`).orWhereILike('description', `%${q}%`)
      })
    }

    if (dateFrom) {
      rolesQuery.where('createdAt', '>=', dateFrom)
    }

    if (dateTo) {
      rolesQuery.where('createdAt', '<=', dateTo)
    }

    const ALLOWED_SORT_COLUMNS = ['name', 'createdAt', 'updatedAt']
    const sortColumn = ALLOWED_SORT_COLUMNS.includes(sortBy) ? sortBy : 'name'
    const sortDirection = sortOrder === 'asc' ? 'asc' : 'desc'
    rolesQuery.orderBy(sortColumn, sortDirection)

    const paginatedRoles = await rolesQuery.paginate(page, limit)

    return inertia.render('admin/roles/index', {
      roles: RoleTransformer.paginate(paginatedRoles.all(), paginatedRoles.getMeta()),
      q,
      dateFrom: dateFrom ?? '',
      dateTo: dateTo ?? '',
      sortBy: sortBy ?? 'name',
      sortOrder: sortOrder ?? 'asc',
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.with('RolePolicy').authorize('create')
    return inertia.render('admin/roles/form', {})
  }

  async store({ request, response, session, bouncer }: HttpContext) {
    try {
      await bouncer.with('RolePolicy').authorize('create')
      const payload = await request.validateUsing(createRoleValidator)
      await Role.create(payload)
      session.flash('success', 'Role created successfully.')
      return response.redirect().toRoute('admin.roles.index')
    } catch (error) {
      session.flash('error', 'Failed to create role.')
      return response.redirect().back()
    }
  }

  async edit({ params, inertia, bouncer }: HttpContext) {
    const role = await Role.findOrFail(params.id)
    await bouncer.with('RolePolicy').authorize('update')

    await role.loadCount('users')

    return inertia.render('admin/roles/form', {
      role: RoleTransformer.transform(role),
    })
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    try {
      const role = await Role.findOrFail(params.id)
      await bouncer.with('RolePolicy').authorize('update')

      const payload = await request.validateUsing(updateRoleValidator, {
        meta: { id: role.id },
      })
      await role.merge(payload).save()
      session.flash('success', 'Role updated successfully.')
      return response.redirect().toRoute('admin.roles.index')
    } catch (error) {
      session.flash('error', 'Failed to update role.')
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    try {
      const role = await Role.findOrFail(params.id)
      await bouncer.with('RolePolicy').authorize('delete')

      // Check if role has users
      await role.loadCount('users')
      if (role.$extras.usersCount > 0) {
        session.flash('error', 'Cannot delete role with assigned users.')
        return response.redirect().back()
      }

      await role.delete()
      session.flash('success', 'Role deleted successfully.')
      return response.redirect().toRoute('admin.roles.index')
    } catch (error) {
      session.flash('error', 'Failed to delete role.')
      return response.redirect().back()
    }
  }

  async apiIndex({ response }: HttpContext) {
    const roles = await Role.query()
    return response.ok({
      roles: roles.map((role) => ({ id: role.id, name: role.name })),
    })
  }
}
