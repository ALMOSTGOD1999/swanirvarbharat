import ms from 'ms'
import { DateTime } from 'luxon'

import type User from '#models/user'

import BaseAction from '#actions/base_action'
import { appIdleActive } from '#config/app'

export default class DestroyExpiredSessions extends BaseAction {
  async handle(user: User) {
    const expiry = DateTime.now().minus({ milliseconds: ms(appIdleActive) })
    console.log(`Signing out expired sessions for user ${user.id}. Expiry = ${expiry.toString()}`)

    await user
      .related('sessions')
      .query()
      .whereNull('logoutAt')
      .where((query) =>
        query.where((q2) =>
          q2
            // last activity is beyond session duration
            .where('lastTouchedAt', '<=', expiry.toSQL()!)
        )
      )
      .update({
        logoutAt: DateTime.now(),
      })
  }
}
