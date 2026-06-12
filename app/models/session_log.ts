import { compose } from '@adonisjs/core/helpers'
import { belongsTo } from '@adonisjs/lucid/orm'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { SessionLogSchema } from '#database/schema'
import User from '#models/user'
import { withID } from '#utils/with_id_mixin'

export default class SessionLog extends compose(SessionLogSchema, withID) {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
