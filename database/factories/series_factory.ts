import factory from '@adonisjs/lucid/factories'
import { States } from '#enums/states'
import Series from '#models/series'
import { UserFactory } from '#database/factories/user_factory'
import { AssetFactory } from '#database/factories/asset_factory'
import { PostFactory } from '#database/factories/post_factory'
import { TaxonomyFactory } from '#database/factories/taxonomy_factory'

export const SeriesFactory = factory
  .define(Series, ({ faker }) => ({
    name: faker.lorem.words({ min: 3, max: 6 }),
    description: faker.lorem.sentence(),
    state: States.DRAFT,
    isFeatured: faker.datatype.boolean(),
  }))
  .state('published', (series) => {
    series.state = States.PUBLIC
  })
  .state('draft', (series) => {
    series.state = States.DRAFT
  })
  .state('featured', (series) => {
    series.isFeatured = true
  })
  .relation('owner', () => UserFactory)
  .relation('asset', () => AssetFactory)
  .relation('posts', () => PostFactory)
  .relation('taxonomies', () => TaxonomyFactory)
  .build()
