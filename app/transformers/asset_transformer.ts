import { BaseTransformer } from '@adonisjs/core/transformers'
import type Asset from '#models/asset'

export default class AssetTransformer extends BaseTransformer<Asset> {
  toObject() {
    return {
      ...this.pick(this.resource, ['altText', 'createdAt', 'credit', 'id', 'type', 'updatedAt']),
      url: this.resource.asset?.url,
    }
  }
}
