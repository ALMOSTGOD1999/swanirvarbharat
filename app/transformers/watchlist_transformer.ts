import { BaseTransformer } from '@adonisjs/core/transformers'
import type Watchlist from '#models/watchlist'

export default class WatchlistTransformer extends BaseTransformer<Watchlist> {
  toObject() {
    return this.pick(this.resource, ['id', 'userId', 'postId', 'taxonomyId', 'createdAt'])
  }
}
