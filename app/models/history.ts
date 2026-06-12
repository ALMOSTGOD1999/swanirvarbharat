import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { HistorySchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { withID } from '#utils/with_id_mixin'
import User from '#models/user'
import Post from '#models/post'
import Taxonomy from '#models/taxonomy'

export default class History extends compose(HistorySchema, withID) {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>

  @belongsTo(() => Taxonomy)
  declare taxonomy: BelongsTo<typeof Taxonomy>
}
