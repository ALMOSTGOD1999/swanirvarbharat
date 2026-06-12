import { compose } from '@adonisjs/core/helpers'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

import { PostChapterSchema } from '#database/schema'
import Post from '#models/post'
import { withID } from '#utils/with_id_mixin'

export default class PostChapter extends compose(PostChapterSchema, withID) {
  @column()
  declare postId: string

  @column()
  declare title: string

  @column()
  declare time: number

  @column()
  declare sortOrder: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>
}
