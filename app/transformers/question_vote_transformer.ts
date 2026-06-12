import { BaseTransformer } from '@adonisjs/core/transformers'
import type QuestionVote from '#models/question_vote'

export default class QuestionVoteTransformer extends BaseTransformer<QuestionVote> {
  toObject() {
    return this.pick(this.resource, ['id', 'userId', 'questionId', 'createdAt'])
  }
}
