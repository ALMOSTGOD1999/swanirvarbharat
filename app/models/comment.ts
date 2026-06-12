import { CommentSchema } from '#database/schema'
import User from '#models/user'
import Post from '#models/post'
import Discussion from '#models/discussion'
import { beforeCreate, computed, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { TimeService } from '#services/time_service'
import { compose } from '@adonisjs/core/helpers'
import { withID } from '#utils/with_id_mixin'
import { CommentStateIds } from '#enums/comment_state_ids'

export default class Comment extends compose(CommentSchema, withID) {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>

  @belongsTo(() => Discussion)
  declare discussion: BelongsTo<typeof Discussion>

  @belongsTo(() => Comment, { foreignKey: 'replyTo' })
  declare parent: BelongsTo<typeof Comment>

  @hasMany(() => Comment, { foreignKey: 'replyTo' })
  declare responses: HasMany<typeof Comment>

  @manyToMany(() => User, {
    pivotTable: 'comment_votes',
  })
  declare userVotes: ManyToMany<typeof User>

  @computed()
  get isPublic() {
    return this.stateId === CommentStateIds.PUBLIC
  }

  @computed()
  get timeago() {
    return TimeService.timeAgo(this.createdAt!)
  }

  @beforeCreate()
  static async fillDefaults(comment: Comment) {
    if (!comment.rootParentId) {
      comment.rootParentId = comment.id
    }
    comment.stateId = CommentStateIds.PUBLIC
  }
}
