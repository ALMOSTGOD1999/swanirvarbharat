import { BaseTransformer } from '@adonisjs/core/transformers'
import type RememberMeToken from '#models/remember_me_token'

export default class RememberMeTokenTransformer extends BaseTransformer<RememberMeToken> {
  toObject() {
    return this.pick(this.resource, ['id', 'tokenableId', 'createdAt', 'updatedAt', 'expiresAt'])
  }
}
