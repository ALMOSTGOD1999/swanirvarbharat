import { BaseTransformer } from '@adonisjs/core/transformers'
import type RequestVote from '#models/request_vote'

export default class RequestVoteTransformer extends BaseTransformer<RequestVote> {
  toObject() {
    return this.pick(this.resource, ['id', 'userId', 'lessonRequestId', 'createdAt'])
  }
}
