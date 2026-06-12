import { BaseTransformer } from '@adonisjs/core/transformers'

import type Path from '#models/path'
import AssetTransformer from '#transformers/asset_transformer'
import CourseTransformer from '#transformers/course_transformer'
import UserTransformer from '#transformers/user_transformer'

export default class PathTransformer extends BaseTransformer<Path> {
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
      coursesCount: this.whenCounted('courses'),
      courses: CourseTransformer.transform(this.whenLoaded(this.resource.courses)),
    }
  }
}
