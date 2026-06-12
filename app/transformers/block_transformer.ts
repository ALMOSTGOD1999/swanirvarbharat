import { BaseTransformer } from '@adonisjs/core/transformers'
import type Block from '#models/block'

export default class BlockTransformer extends BaseTransformer<Block> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'userId',
      'sectionId',
      'ipAddress',
      'reason',
      'expiresAt',
      'createdAt',
    ])
  }
}
