import { BaseTransformer } from '@adonisjs/core/transformers'
import type DiscussionVote from '#models/discussion_vote'

export default class DiscussionVoteTransformer extends BaseTransformer<DiscussionVote> {
  toObject() {
    return this.pick(this.resource, ['id', 'userId', 'discussionId', 'createdAt'])
  }
}
