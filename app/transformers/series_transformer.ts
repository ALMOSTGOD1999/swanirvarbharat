import { BaseTransformer } from '@adonisjs/core/transformers'

import type Series from '#models/series'
import AssetTransformer from '#transformers/asset_transformer'
import TaxonomyTransformer from '#transformers/taxonomy_transformer'
import UserTransformer from '#transformers/user_transformer'
import AccessLevelTransformer from '#transformers/access_level_transformer'

export default class SeriesTransformer extends BaseTransformer<Series> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'createdAt',
        'description',
        'id',
        'isFeatured',
        'name',
        'ownerId',
        'slug',
        'sortOrder',
        'state',
        'accessLevelId',
        'enrollmentAttemptLimit',
        'updatedAt',
      ]),
      owner: UserTransformer.transform(this.whenLoaded(this.resource.owner)),
      asset: AssetTransformer.transform(this.whenLoaded(this.resource.asset)),
      taxonomies: TaxonomyTransformer.transform(this.whenLoaded(this.resource.taxonomies)),
      accessLevel: AccessLevelTransformer.transform(this.whenLoaded(this.resource.accessLevel)),
      postsCount: this.whenCounted('posts'),
      videoSecondsSum: Number(this.resource.$extras?.video_seconds_sum ?? 0),
    }
  }
}
