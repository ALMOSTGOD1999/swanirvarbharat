import { BaseTransformer } from '@adonisjs/core/transformers'

import type User from '#models/user'

import ProfileTransformer from '#transformers/profile_transformer'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'roleId',
        'username',
        'email',
        'avatar',
        'emailVerifiedAt',
        'createdAt',
        'updatedAt',
      ]),
      profile: ProfileTransformer.transform(this.whenLoaded(this.resource.profile)),
    }
  }
}
