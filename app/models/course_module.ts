import { compose } from '@adonisjs/core/helpers'
import { belongsTo, column, computed, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import { CourseModuleSchema } from '#database/schema'
import type { State } from '#enums/states'
import { withID } from '#utils/with_id_mixin'
import Course from '#models/course'
import CourseModulePost from '#models/course_module_post'

export default class CourseModule extends compose(CourseModuleSchema, withID) {
  @column()
  declare courseId: string

  @column()
  declare state: State

  @column()
  declare sortOrder: number

  @belongsTo(() => Course)
  declare course: BelongsTo<typeof Course>

  @hasMany(() => CourseModulePost)
  declare modulePosts: HasMany<typeof CourseModulePost>

  @computed()
  get moduleNumber() {
    return this.sortOrder + 1
  }
}
