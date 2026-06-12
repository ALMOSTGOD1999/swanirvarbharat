import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { QuestionSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { withID } from '#utils/with_id_mixin'
import User from '#models/user'
import QuestionVote from '#models/question_vote'

export default class Question extends compose(QuestionSchema, withID) {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => QuestionVote)
  declare votes: HasMany<typeof QuestionVote>
}
