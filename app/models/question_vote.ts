import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { QuestionVoteSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { withID } from '#utils/with_id_mixin'
import User from '#models/user'
import Question from '#models/question'

export default class QuestionVote extends compose(QuestionVoteSchema, withID) {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Question)
  declare question: BelongsTo<typeof Question>
}
