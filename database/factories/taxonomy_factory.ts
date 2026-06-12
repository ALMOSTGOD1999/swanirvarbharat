import factory from '@adonisjs/lucid/factories'
import Taxonomy from '#models/taxonomy'
import { PostFactory } from '#database/factories/post_factory'
import { AssetFactory } from '#database/factories/asset_factory'

export const TaxonomyFactory = factory
  .define(Taxonomy, ({ faker }) => ({
    name: faker.word.words({ count: { min: 1, max: 3 } }),
    description: faker.lorem.sentence(),
  }))
  .relation('posts', () => PostFactory)
  .relation('children', () => TaxonomyFactory)
  .relation('asset', () => AssetFactory)
  .build()
