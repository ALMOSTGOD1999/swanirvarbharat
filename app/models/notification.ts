import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { NotificationSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { withID } from '#utils/with_id_mixin'
import User from '#models/user'

export default class Notification extends compose(NotificationSchema, withID) {
  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'initiatorUserId' })
  declare initiator: BelongsTo<typeof User>
}
