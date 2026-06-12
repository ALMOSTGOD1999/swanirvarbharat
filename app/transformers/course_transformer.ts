import { BaseTransformer } from '@adonisjs/core/transformers'

import type Course from '#models/course'
import AssetTransformer from '#transformers/asset_transformer'
import TaxonomyTransformer from '#transformers/taxonomy_transformer'
import UserTransformer from '#transformers/user_transformer'
import AccessLevelTransformer from '#transformers/access_level_transformer'

export default class CourseTransformer extends BaseTransformer<Course> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'createdAt',
        'description',
        'difficulty',
        'id',
        'isFeatured',
        'metaDescription',
        'name',
        'ownerId',
        'pageTitle',
        'slug',
        'sortOrder',
        'state',
        'accessLevelId',
        'enrollmentAttemptLimit',
        'updatedAt',
      ]),
      owner: UserTransformer.transform(this.whenLoaded(this.resource.owner)),
      asset: AssetTransformer.transform(this.whenLoaded(this.resource.asset)),
      accessLevel: AccessLevelTransformer.transform(this.whenLoaded(this.resource.accessLevel)),
      taxonomies: TaxonomyTransformer.transform(this.whenLoaded(this.resource.taxonomies)),
      modulesCount: this.whenCounted('modules'),
    }
  }
}
