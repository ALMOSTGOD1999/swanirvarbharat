import { belongsTo } from '@adonisjs/lucid/orm'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { ProfileSchema } from '#database/schema'
import User from '#models/user'

export default class Profile extends ProfileSchema {
  @belongsTo(() => User, {
    foreignKey: 'id',
    localKey: 'id',
  })
  declare user: BelongsTo<typeof User>
}
