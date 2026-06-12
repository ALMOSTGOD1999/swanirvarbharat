import { BaseTransformer } from '@adonisjs/core/transformers'
import type Notification from '#models/notification'
import UserTransformer from '#transformers/user_transformer'

export default class NotificationTransformer extends BaseTransformer<Notification> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'global',
        'userId',
        'initiatorUserId',
        'notificationTypeId',
        'tableName',
        'tableId',
        'title',
        'body',
        'href',
        'readAt',
        'actionedAt',
        'createdAt',
        'updatedAt',
      ]),
      user: UserTransformer.transform(this.whenLoaded(this.resource.user)),
      initiator: UserTransformer.transform(this.whenLoaded(this.resource.initiator)),
    }
  }
}
