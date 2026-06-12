import BaseAction from '#actions/base_action'
import type User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { getIpAddress } from '#utils/get_ip'
import { getUserAgent } from '#utils/get_user_agent'
import StoreSessionLog from '#actions/auth/store_session_log'
import { events } from '#generated/events'
import { sessionLogCookieName } from '#config/auth'

interface Event {
  ctx: HttpContext
  guardName: string
  user: User
}

type Arguments = [ctx: HttpContext, user: User, isSkipNewDevice?: boolean]

export default class OnSignInSucceeded extends BaseAction {
  async asListener({ ctx, user }: Event) {
    await this.handle(ctx, user)
  }

  async handle(...args: Arguments) {
    const [ctx, user, isSkipNewDevice] = args

    const ipAddress = getIpAddress(ctx.request)
    const ua = getUserAgent(ctx.request.header('User-Agent'))
    const browserName = ua?.browser.name
    const deviceModel = ua?.device.model
    const osName = ua?.os.name
    const osVersion = ua?.os.version

    const knownSession = await user
      .related('sessions')
      .query()
      .where((query) => {
        if (ipAddress && browserName && deviceModel && osName && osVersion) {
          query.where((uaQuery) => {
            uaQuery.where({ ipAddress, browserName, deviceModel, osName, osVersion })
          })
        }
        if (ipAddress && ua) {
          query.orWhere((ipQuery) => ipQuery.where({ ipAddress, userAgent: ua.ua }))
        }
      })
      .where('loginSuccessful', true)
      .first()
    const sessionLog = await StoreSessionLog.run(user, ipAddress, ua, ctx.session.sessionId)

    if (!user.profile) {
      await user.load('profile')
    }

    if (!knownSession && !isSkipNewDevice && user.profile.emailOnNewDeviceLogin) {
      await events.EmailNewDevice.dispatch(user, sessionLog)
    }

    ctx.response.encryptedCookie(sessionLogCookieName, sessionLog.token, {
      httpOnly: true,
    })

    ctx.session.put(sessionLogCookieName, sessionLog.token)
  }
}
