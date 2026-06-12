import { compose } from '@adonisjs/core/helpers'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { CourseModulePostSchema } from '#database/schema'
import { withID } from '#utils/with_id_mixin'
import CourseModule from '#models/course_module'
import Post from '#models/post'

export default class CourseModulePost extends compose(CourseModulePostSchema, withID) {
  @column()
  declare courseModuleId: string

  @column()
  declare postId: string

  @column()
  declare sortOrder: number

  @belongsTo(() => CourseModule)
  declare courseModule: BelongsTo<typeof CourseModule>

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>
}
