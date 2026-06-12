import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DiscussionVoteSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { withID } from '#utils/with_id_mixin'
import User from '#models/user'
import Discussion from '#models/discussion'

export default class DiscussionVote extends compose(DiscussionVoteSchema, withID) {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Discussion)
  declare discussion: BelongsTo<typeof Discussion>
}
