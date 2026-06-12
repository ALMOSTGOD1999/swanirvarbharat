import { compose } from '@adonisjs/core/helpers'
import { belongsTo, column, computed, hasMany, manyToMany, scope } from '@adonisjs/lucid/orm'
import { slugify } from '@adonisjs/lucid-slugify'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import type { TaxonomyType } from '#enums/taxonomy'

import { TaxonomySchema } from '#database/schema'
import { withID } from '#utils/with_id_mixin'
import Post from '#models/post'
import User from '#models/user'
import { States } from '#enums/states'
import Asset from '#models/asset'

export default class Taxonomy extends compose(TaxonomySchema, withID) {
  @column()
  declare type: TaxonomyType

  @slugify({
    fields: ['name'],
    strategy: 'shortId',
  })
  declare slug: string

  @belongsTo(() => Asset)
  declare asset: BelongsTo<typeof Asset>

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  declare owner: BelongsTo<typeof User>

  @belongsTo(() => Taxonomy, {
    foreignKey: 'parentId',
  })
  declare parent: BelongsTo<typeof Taxonomy>

  @hasMany(() => Taxonomy, {
    foreignKey: 'parentId',
  })
  declare children: HasMany<typeof Taxonomy>

  @manyToMany(() => Post, {
    pivotTable: 'post_taxonomies',
    pivotColumns: ['sort_order'],
  })
  declare posts: ManyToMany<typeof Post>

  @computed()
  get abbrev() {
    const acronym = this.name
      .match(/\b([A-Z])/g)
      ?.reduce(
        (previous, next) =>
          previous + (+next === 0 || Number.parseInt(next) ? Number.parseInt(next) : next[0] || ''),
        ''
      )
      .toUpperCase()
    return acronym ?? ''
  }

  static roots() {
    return this.query().whereNull('parentId')
  }

  static children(parentId: number | null = null) {
    if (parentId) {
      return this.query().where('parentId', parentId)
    }

    return this.query().whereNotNull('parentId')
  }

  static hasContent = scope<
    typeof Taxonomy,
    (query: ModelQueryBuilderContract<typeof Taxonomy>) => void
  >((query) => {
    query.where((q) => q.orWhereHas('posts', (p) => p.apply((s) => s.published())))
  })

  static withPostLatestPublished = scope<
    typeof Taxonomy,
    (query: ModelQueryBuilderContract<typeof Taxonomy>) => void
  >((query) => {
    query.select(
      db.rawQuery(
        `(
        select
          p.published_at
        from
          posts as p inner join post_taxonomies
            on p.id = post_taxonomies.post_id
            where
                  taxonomies.id = post_taxonomies.taxonomy_id
              and p.state_id = ?
              and p.is_personal = false
              and p.published_at <= ?
            order by p.published_at desc
            limit 1
      ) as latest_published_at`,
        [States.PUBLIC, DateTime.local().toSQL()]
      )
    )
  })
}
