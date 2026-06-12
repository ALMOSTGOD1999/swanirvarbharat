import { compose } from '@adonisjs/core/helpers'
import { hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { attachment } from '@jrmc/adonis-attachment'

import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'

import { AssetSchema } from '#database/schema'
import Post from '#models/post'
import Taxonomy from '#models/taxonomy'
import { withID } from '#utils/with_id_mixin'

export default class Asset extends compose(AssetSchema, withID) {
  @attachment({
    preComputeUrl: true,
    folder: 'assets',
    rename: (asset: Asset) => `${asset.id}.${asset.asset.extname}`,
    meta: true,
  })
  declare asset: Attachment

  @manyToMany(() => Post, {
    pivotTable: 'asset_posts',
    pivotColumns: ['sort_order'],
    pivotTimestamps: true,
  })
  declare posts: ManyToMany<typeof Post>

  @hasMany(() => Taxonomy)
  declare taxonomies: HasMany<typeof Taxonomy>
}
