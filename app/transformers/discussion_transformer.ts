import { BaseTransformer } from '@adonisjs/core/transformers'
import type Discussion from '#models/discussion'
import UserTransformer from '#transformers/user_transformer'
import TaxonomyTransformer from '#transformers/taxonomy_transformer'

export default class DiscussionTransformer extends BaseTransformer<Discussion> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'userId',
        'taxonomyId',
        'stateId',
        'title',
        'slug',
        'body',
        'views',
        'solvedAt',
        'solvedCommentId',
        'createdAt',
        'updatedAt',
      ]),
      user: UserTransformer.transform(this.whenLoaded(this.resource.user)),
      taxonomy: TaxonomyTransformer.transform(this.whenLoaded(this.resource.taxonomy)),
      votesCount: this.resource.$extras?.votes_count ?? 0,
      commentsCount: this.resource.$extras?.comments_count ?? 0,
    }
  }
}
