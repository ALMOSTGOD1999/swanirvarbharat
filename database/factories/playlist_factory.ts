import factory from '@adonisjs/lucid/factories'
import { States } from '#enums/states'
import Playlist from '#models/playlist'
import { UserFactory } from '#database/factories/user_factory'
import { AssetFactory } from '#database/factories/asset_factory'
import { PostFactory } from '#database/factories/post_factory'

export const PlaylistFactory = factory
  .define(Playlist, ({ faker }) => ({
    name: faker.lorem.words({ min: 3, max: 6 }),
    description: faker.lorem.sentence(),
    state: States.DRAFT,
    isFeatured: faker.datatype.boolean(),
  }))
  .state('published', (pl) => {
    pl.state = States.PUBLIC
  })
  .state('draft', (pl) => {
    pl.state = States.DRAFT
  })
  .relation('owner', () => UserFactory)
  .relation('asset', () => AssetFactory)
  .relation('posts', () => PostFactory)
  .build()
