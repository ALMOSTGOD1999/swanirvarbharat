import { BaseTransformer } from '@adonisjs/core/transformers'
import type LessonRequest from '#models/lesson_request'
import UserTransformer from '#transformers/user_transformer'

export default class LessonRequestTransformer extends BaseTransformer<LessonRequest> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'userId',
        'stateId',
        'priority',
        'name',
        'body',
        'createdAt',
        'updatedAt',
      ]),
      user: UserTransformer.transform(this.whenLoaded(this.resource.user)),
      votesCount: this.resource.$extras?.votes_count ?? 0,
    }
  }
}
