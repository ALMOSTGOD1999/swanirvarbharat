import { compose } from '@adonisjs/core/helpers'
import { belongsTo } from '@adonisjs/lucid/orm'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { PostSnapshotSchema } from '#database/schema'
import Post from '#models/post'
import { withID } from '#utils/with_id_mixin'

export default class PostSnapshot extends compose(PostSnapshotSchema, withID) {
  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>
}
