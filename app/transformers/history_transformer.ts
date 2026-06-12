import { BaseTransformer } from '@adonisjs/core/transformers'
import type History from '#models/history'

export default class HistoryTransformer extends BaseTransformer<History> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'userId',
      'postId',
      'taxonomyId',
      'historyTypeId',
      'route',
      'readPercent',
      'watchPercent',
      'isCompleted',
      'watchSeconds',
      'createdAt',
      'updatedAt',
    ])
  }
}
