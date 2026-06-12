import { BaseEvent } from '@adonisjs/core/events'
import type User from '#models/user'

export default class EmailPasswordReset extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(
    public user: User,
    public signedUrl: string
  ) {
    super()
  }
}
