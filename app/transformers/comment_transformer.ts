import type Comment from '#models/comment'
import { BaseTransformer } from '@adonisjs/core/transformers'
import UserTransformer from '#transformers/user_transformer'
import PostTransformer from '#transformers/post_transformer'

export default class CommentTransformer extends BaseTransformer<Comment> {
  toObject() {
    const userVotes = this.whenLoaded(this.resource.userVotes)
    const voteCount = Array.isArray(userVotes) ? userVotes.length : 0

    return {
      ...this.pick(this.resource, [
        'id',
        'body',
        'postId',
        'userId',
        'replyTo',
        'rootParentId',
        'stateId',
        'name',
        'createdAt',
      ]),
      user: UserTransformer.transform(this.whenLoaded(this.resource.user)),
      post: PostTransformer.transform(this.whenLoaded(this.resource.post)),
      voteCount,
      userVotes: Array.isArray(userVotes) ? userVotes.map((v) => v.id ?? v) : [],
    }
  }
}
