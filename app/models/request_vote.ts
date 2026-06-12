import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { RequestVoteSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { withID } from '#utils/with_id_mixin'
import User from '#models/user'
import LessonRequest from '#models/lesson_request'

export default class RequestVote extends compose(RequestVoteSchema, withID) {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => LessonRequest)
  declare lessonRequest: BelongsTo<typeof LessonRequest>
}
