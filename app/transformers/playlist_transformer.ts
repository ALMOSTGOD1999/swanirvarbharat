import { BaseTransformer } from '@adonisjs/core/transformers'

import type Playlist from '#models/playlist'
import AssetTransformer from '#transformers/asset_transformer'
import UserTransformer from '#transformers/user_transformer'

export default class PlaylistTransformer extends BaseTransformer<Playlist> {
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
        'state',
        'updatedAt',
      ]),
      owner: UserTransformer.transform(this.whenLoaded(this.resource.owner)),
      asset: AssetTransformer.transform(this.whenLoaded(this.resource.asset)),
      postsCount: this.whenCounted('posts'),
    }
  }
}
