import { BaseTransformer } from '@adonisjs/core/transformers'
import type Question from '#models/question'
import UserTransformer from '#transformers/user_transformer'

export default class QuestionTransformer extends BaseTransformer<Question> {
  toObject() {
    return {
      ...this.pick(this.resource, ['id', 'userId', 'title', 'body', 'createdAt', 'updatedAt']),
      user: UserTransformer.transform(this.whenLoaded(this.resource.user)),
      votesCount: this.resource.$extras?.votes_count ?? 0,
    }
  }
}
