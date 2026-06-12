import type { HttpContext } from '@adonisjs/core/http'
import {
  accessLevelIndexValidator,
  createAccessLevelValidator,
  updateAccessLevelValidator,
  reorderAccessLevelsValidator,
} from '#validators/access_level'
import AccessLevel from '#models/access_level'
import db from '@adonisjs/lucid/services/db'
import AccessLevelTransformer from '#transformers/access_level_transformer'

export default class AccessLevelsController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.with('AccessLevelPolicy').authorize('viewList')
    await accessLevelIndexValidator.validate(request.qs())

    const accessLevels = await AccessLevel.query().orderBy('sortOrder', 'asc')

    return inertia.render('admin/access_levels/index', {
      accessLevels: AccessLevelTransformer.transform(accessLevels),
    })
  }

  async store({ request, response, session, bouncer }: HttpContext) {
    await bouncer.with('AccessLevelPolicy').authorize('create')
    const data = await request.validateUsing(createAccessLevelValidator)

    const trx = await db.transaction()

    try {
      if (data.sortOrder === undefined) {
        const last = await AccessLevel.query({ client: trx }).orderBy('sortOrder', 'desc').first()
        data.sortOrder = (last?.sortOrder ?? -1) + 1
      }

      await AccessLevel.create(data, { client: trx })

      await trx.commit()

      session.flash('success', 'Access level created successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to create access level.')
      throw error
    }
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    const accessLevel = await AccessLevel.query().where('id', params.id).firstOrFail()
    await bouncer.with('AccessLevelPolicy').authorize('update', accessLevel)
    const data = await request.validateUsing(updateAccessLevelValidator)

    const trx = await db.transaction()

    try {
      accessLevel.useTransaction(trx)
      accessLevel.merge(data)
      await accessLevel.save()

      await trx.commit()

      session.flash('success', 'Access level updated successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to update access level.')
      throw error
    }
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    const accessLevel = await AccessLevel.query().where('id', params.id).firstOrFail()
    await bouncer.with('AccessLevelPolicy').authorize('delete', accessLevel)

    const coursesUsing = await db.from('courses').where('access_level_id', accessLevel.id).first()

    if (coursesUsing) {
      session.flash('error', 'Cannot delete access level that is in use by courses.')
      return response.redirect().back()
    }

    const trx = await db.transaction()

    try {
      await AccessLevel.query({ client: trx }).where('id', accessLevel.id).delete()

      await trx.commit()

      session.flash('success', 'Access level deleted successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to delete access level.')
      throw error
    }
  }

  async reorder({ request, response, session, bouncer }: HttpContext) {
    await bouncer.with('AccessLevelPolicy').authorize('viewList')
    const { accessLevelIds } = await request.validateUsing(reorderAccessLevelsValidator)

    const trx = await db.transaction()

    try {
      for (let i = 0; i < accessLevelIds.length; i++) {
        await AccessLevel.query({ client: trx })
          .where('id', accessLevelIds[i])
          .update({ sortOrder: i })
      }

      await trx.commit()

      session.flash('success', 'Access level order updated successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to update access level order.')
      throw error
    }
  }
}
