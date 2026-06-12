import { DateTime } from 'luxon'

import type { HttpContext } from '@adonisjs/core/http'
import type User from '#models/user'

import BaseAction from '#actions/base_action'
import { sessionLogCookieName } from '#config/auth'

type Arguments = [ctx: HttpContext, user: User]

export default class OnSignOutSucceeded extends BaseAction {
  async handle(...args: Arguments) {
    const [ctx, user] = args

    const token = await ctx.request.encryptedCookie(
      sessionLogCookieName,
      ctx.session.get(sessionLogCookieName)
    )
    const logs = await user
      .related('sessions')
      .query()
      .where('token', token)
      .where('loginSuccessful', true)
      .whereNull('logoutAt')
      .orderBy('loginAt', 'desc')

    for (const log of logs) {
      log.logoutAt = DateTime.now()
      await log.save()
    }

    ctx.response.clearCookie(sessionLogCookieName)
    ctx.session.forget(sessionLogCookieName)
  }
}
