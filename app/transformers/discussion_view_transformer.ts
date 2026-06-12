import { BaseTransformer } from '@adonisjs/core/transformers'
import type DiscussionView from '#models/discussion_view'

export default class DiscussionViewTransformer extends BaseTransformer<DiscussionView> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'userId',
      'discussionId',
      'typeId',
      'ipAddress',
      'userAgent',
      'createdAt',
    ])
  }
}
