import { BaseEvent } from '@adonisjs/core/events'

import type User from '#models/user'
import type SessionLog from '#models/session_log'

export default class EmailNewDevice extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(
    public user: User,
    public sessionLog: SessionLog
  ) {
    super()
  }
}
