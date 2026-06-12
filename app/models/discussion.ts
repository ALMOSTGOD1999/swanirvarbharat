import { belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { slugify } from '@adonisjs/lucid-slugify'
import { DiscussionSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { withID } from '#utils/with_id_mixin'
import User from '#models/user'
import Taxonomy from '#models/taxonomy'
import Comment from '#models/comment'
import DiscussionView from '#models/discussion_view'

export default class Discussion extends compose(DiscussionSchema, withID) {
  @slugify({ strategy: 'dbIncrement', fields: ['title'] })
  declare slug: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Taxonomy)
  declare taxonomy: BelongsTo<typeof Taxonomy>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @hasMany(() => DiscussionView)
  declare discussionViews: HasMany<typeof DiscussionView>

  @manyToMany(() => User, {
    pivotTable: 'discussion_votes',
  })
  declare votes: ManyToMany<typeof User>
}
