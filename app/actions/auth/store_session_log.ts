import { DateTime } from 'luxon'

import type { IResult } from 'ua-parser-js'
import type User from '#models/user'

import DestroyExpiredSessions from '#actions/auth/destroy_expired_session'
import BaseAction from '#actions/base_action'
import { getLocation } from '#utils/get_location'
import { cuid } from '#utils/id'

type Arguments = [
  user: User,
  ipAddress: string | undefined,
  userAgent: IResult | undefined,
  sessionId: string,
]

export default class StoreSessionLog extends BaseAction {
  async handle(...args: Arguments) {
    const [user, ipAddress, ua, sessionId] = args

    await DestroyExpiredSessions.run(user)

    const { city, countryLong, countryShort } = getLocation(ipAddress)
    return user.related('sessions').create({
      ipAddress,
      userAgent: ua?.ua,
      browserName: ua?.browser?.name,
      browserEngine: ua?.engine?.name,
      browserVersion: ua?.browser?.version,
      deviceModel: ua?.device?.model,
      deviceType: ua?.device?.type,
      deviceVendor: ua?.device?.vendor,
      osName: ua?.os?.name,
      osVersion: ua?.os?.version,
      city,
      sessionId,
      country: countryLong,
      countryCode: countryShort,
      token: cuid(16),
      loginAt: DateTime.now(),
      loginSuccessful: true,
      lastTouchedAt: DateTime.now(),
    })
  }
}
