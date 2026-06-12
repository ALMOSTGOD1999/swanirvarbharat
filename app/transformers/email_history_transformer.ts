import { BaseTransformer } from '@adonisjs/core/transformers'
import type EmailHistory from '#models/email_history'

export default class EmailHistoryTransformer extends BaseTransformer<EmailHistory> {
  toObject() {
    return this.pick(this.resource, ['id', 'userId', 'emailFrom', 'emailTo', 'createdAt'])
  }
}
