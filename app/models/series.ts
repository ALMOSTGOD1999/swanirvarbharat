import { compose } from '@adonisjs/core/helpers'
import { belongsTo, column, manyToMany, scope } from '@adonisjs/lucid/orm'
import { slugify } from '@adonisjs/lucid-slugify'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'

import { SeriesSchema } from '#database/schema'
import { States } from '#enums/states'
import type { State } from '#enums/states'
import { withID } from '#utils/with_id_mixin'
import User from '#models/user'
import Asset from '#models/asset'
import Post from '#models/post'
import Taxonomy from '#models/taxonomy'
import AccessLevel from '#models/access_level'
import db from '@adonisjs/lucid/services/db'

export default class Series extends compose(SeriesSchema, withID) {
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

  @column()
  declare sortOrder: number

  @column()
  declare accessLevelId: string | null

  @column()
  declare enrollmentAttemptLimit: number

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  declare owner: BelongsTo<typeof User>

  @belongsTo(() => Asset)
  declare asset: BelongsTo<typeof Asset>

  @belongsTo(() => AccessLevel)
  declare accessLevel: BelongsTo<typeof AccessLevel>

  @manyToMany(() => Post, {
    pivotTable: 'series_posts',
    pivotColumns: ['sort_order'],
    pivotTimestamps: true,
  })
  declare posts: ManyToMany<typeof Post>

  @manyToMany(() => Taxonomy, {
    pivotTable: 'series_taxonomies',
    pivotColumns: ['sort_order'],
    pivotTimestamps: true,
  })
  declare taxonomies: ManyToMany<typeof Taxonomy>

  static published = scope((query) => {
    query.where('state', States.PUBLIC)
  })

  static draft = scope((query) => {
    query.where('state', States.DRAFT)
  })

  static withPostLatestPublished = scope<
    typeof Series,
    (query: ModelQueryBuilderContract<typeof Series>) => void
  >((query) => {
    query.select(
      '*',
      db
        .from('series_posts')
        .join('posts', 'posts.id', 'series_posts.post_id')
        .whereRaw('series_posts.series_id = series.id')
        .where('posts.state', States.PUBLIC)
        .whereNotNull('posts.published_at')
        .orderBy('posts.published_at', 'desc')
        .limit(1)
        .select('posts.published_at')
        .as('latest_published_at')
    )
  })
}
