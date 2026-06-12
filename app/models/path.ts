import { compose } from '@adonisjs/core/helpers'
import { belongsTo, column, manyToMany, scope } from '@adonisjs/lucid/orm'
import { slugify } from '@adonisjs/lucid-slugify'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'

import { PathSchema } from '#database/schema'
import { States } from '#enums/states'
import type { State } from '#enums/states'
import { withID } from '#utils/with_id_mixin'
import User from '#models/user'
import Asset from '#models/asset'
import Course from '#models/course'

export default class Path extends compose(PathSchema, withID) {
  @slugify({
    fields: ['name'],
    strategy: 'dbIncrement',
    maxLength: 255,
  })
  declare slug: string

  @column()
  declare state: State

  @column()
  declare ownerId: string

  @column()
  declare assetId: string | null

  @column()
  declare isFeatured: boolean

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  declare owner: BelongsTo<typeof User>

  @belongsTo(() => Asset)
  declare asset: BelongsTo<typeof Asset>

  @manyToMany(() => Course, {
    pivotTable: 'path_courses',
    pivotColumns: ['sort_order'],
    pivotTimestamps: true,
  })
  declare courses: ManyToMany<typeof Course>

  static published = scope((query) => {
    query.where('state', States.PUBLIC)
  })

  static draft = scope((query) => {
    query.where('state', States.DRAFT)
  })
}
