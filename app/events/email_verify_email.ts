import { BaseEvent } from '@adonisjs/core/events'
import type User from '#models/user'

export default class EmailVerifyEmail extends BaseEvent {
  constructor(
    public user: User,
    public signedUrl: string
  ) {
    super()
  }
}
