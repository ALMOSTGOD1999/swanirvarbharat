import { compose } from '@adonisjs/core/helpers'
import { belongsTo, column, computed, hasMany, manyToMany, scope } from '@adonisjs/lucid/orm'
import { slugify } from '@adonisjs/lucid-slugify'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'

import { CourseSchema } from '#database/schema'
import { States } from '#enums/states'
import type { State } from '#enums/states'
import type { Difficulty } from '#enums/difficulties'
import { withID } from '#utils/with_id_mixin'
import User from '#models/user'
import Asset from '#models/asset'
import AccessLevel from '#models/access_level'
import CourseModule from '#models/course_module'
import Taxonomy from '#models/taxonomy'

export default class Course extends compose(CourseSchema, withID) {
  @slugify({
    fields: ['name'],
    strategy: 'dbIncrement',
    maxLength: 255,
  })
  declare slug: string

  @column()
  declare state: State

  @column()
  declare difficulty: Difficulty

  @column()
  declare ownerId: string

  @column()
  declare accessLevelId: string

  @column()
  declare enrollmentAttemptLimit: number

  @column()
  declare assetId: string | null

  @column()
  declare isFeatured: boolean

  @column()
  declare sortOrder: number

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  declare owner: BelongsTo<typeof User>

  @belongsTo(() => AccessLevel)
  declare accessLevel: BelongsTo<typeof AccessLevel>

  @belongsTo(() => Asset)
  declare asset: BelongsTo<typeof Asset>

  @hasMany(() => CourseModule)
  declare modules: HasMany<typeof CourseModule>

  @manyToMany(() => Taxonomy, {
    pivotTable: 'course_taxonomies',
    pivotColumns: ['sort_order'],
    pivotTimestamps: true,
  })
  declare taxonomies: ManyToMany<typeof Taxonomy>

  @computed()
  get moduleNumber() {
    return this.sortOrder + 1
  }

  static published = scope((query) => {
    query.where('state', States.PUBLIC)
  })

  static draft = scope((query) => {
    query.where('state', States.DRAFT)
  })
}
