import { BaseTransformer } from '@adonisjs/core/transformers'
import type Post from '#models/post'
import TaxonomyTransformer from '#transformers/taxonomy_transformer'
import AssetTransformer from '#transformers/asset_transformer'
import UserTransformer from '#transformers/user_transformer'

export default class PostTransformer extends BaseTransformer<Post> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'body',
        'bodyBlocks',
        'bodyType',
        'canonical',
        'createdAt',
        'description',
        'id',
        'isFeatured',
        'isLivestream',
        'isPersonal',
        'isWatchlistSent',
        'livestreamUrl',
        'metaDescription',
        'pageTitle',
        'postType',
        'publishedAt',
        'publishedAtUser',
        'readMinutes',
        'readTime',
        'redirectUrl',
        'slug',
        'state',
        'timezone',
        'title',
        'updatedAt',
        'updatedContentAt',
        'videoBunnyId',
        'videoSeconds',
        'videoType',
        'videoUrl',
        'viewCount',
        'viewCountUnique',
        'wordCount',
      ]),
      authors: UserTransformer.transform(this.whenLoaded(this.resource.authors)),
      taxonomies: TaxonomyTransformer.transform(this.whenLoaded(this.resource.taxonomies)),
      thumbnail: AssetTransformer.transform(this.whenLoaded(this.resource.thumbnails?.[0])),
      publishedAtDisplay: this.resource.publishedAtDisplay,
      readMinutesDisplay: this.resource.readMinutesDisplay,
    }
  }
}
