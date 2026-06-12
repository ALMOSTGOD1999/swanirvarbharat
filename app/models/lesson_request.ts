import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { LessonRequestSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { withID } from '#utils/with_id_mixin'
import User from '#models/user'
import RequestVote from '#models/request_vote'

export default class LessonRequest extends compose(LessonRequestSchema, withID) {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => RequestVote)
  declare votes: HasMany<typeof RequestVote>
}
