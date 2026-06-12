import { BaseTransformer } from '@adonisjs/core/transformers'
import type Taxonomy from '#models/taxonomy'
import AssetTransformer from '#transformers/asset_transformer'

export default class TaxonomyTransformer extends BaseTransformer<Taxonomy> {
  toObject() {
    const base = this.pick(this.resource, [
      'createdAt',
      'description',
      'id',
      'isFeatured',
      'levelIndex',
      'metaDescription',
      'name',
      'ownerId',
      'pageTitle',
      'parentId',
      'rootParentId',
      'slug',
      'type',
      'updatedAt',
    ])

    return {
      ...base,
      postsCount: this.resource.$extras.posts_count ?? 0,
      childrenCount: this.resource.$extras.children_count ?? 0,
      parent: this.resource.parent ? this.pick(this.resource.parent, ['id', 'name', 'slug']) : null,
      asset: AssetTransformer.transform(this.whenLoaded(this.resource.asset)),
    }
  }
}
