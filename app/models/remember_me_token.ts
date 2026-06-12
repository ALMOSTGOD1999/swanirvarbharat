import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { RememberMeTokenSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { withID } from '#utils/with_id_mixin'
import User from '#models/user'

export default class RememberMeToken extends compose(RememberMeTokenSchema, withID) {
  @belongsTo(() => User, { foreignKey: 'tokenableId' })
  declare user: BelongsTo<typeof User>
}
