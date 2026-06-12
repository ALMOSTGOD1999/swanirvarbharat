import { BaseTransformer } from '@adonisjs/core/transformers'
import type Progress from '#models/progress'

export default class ProgressTransformer extends BaseTransformer<Progress> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'userId',
      'postId',
      'readPercent',
      'watchPercent',
      'watchSeconds',
      'isCompleted',
      'createdAt',
      'updatedAt',
    ])
  }
}
