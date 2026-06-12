import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BlockSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { withID } from '#utils/with_id_mixin'
import User from '#models/user'

export default class Block extends compose(BlockSchema, withID) {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
