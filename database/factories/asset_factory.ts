import factory from '@adonisjs/lucid/factories'

import { AssetTypes } from '#enums/asset'
import Asset from '#models/asset'

export const AssetFactory = factory
  .define(Asset, ({ faker }) => ({
    type: AssetTypes.THUMBNAIL,
    altText: faker.word.words(2),
    credit: faker.person.fullName(),
    asset: { extname: 'png', size: 0, url: faker.image.url() } as any,
  }))
  .state('thumbnail', (row) => {
    row.type = AssetTypes.THUMBNAIL
  })
  .state('cover', (row) => {
    row.type = AssetTypes.COVER
  })
  .state('icon', (row) => {
    row.type = AssetTypes.THUMBNAIL
  })
  .build()
