import { BaseEvent } from '@adonisjs/core/events'

export default class EmailPasswordResetSuccess extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor() {
    super()
  }
}
