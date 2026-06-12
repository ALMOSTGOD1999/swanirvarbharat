import { BaseTransformer } from '@adonisjs/core/transformers'

import type AccessLevel from '#models/access_level'

export default class AccessLevelTransformer extends BaseTransformer<AccessLevel> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'name',
        'color',
        'sortOrder',
        'isDefault',
        'createdAt',
        'updatedAt',
      ]),
    }
  }
}
