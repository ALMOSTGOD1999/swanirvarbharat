import factory from '@adonisjs/lucid/factories'
import { States } from '#enums/states'
import Path from '#models/path'
import { UserFactory } from '#database/factories/user_factory'
import { AssetFactory } from '#database/factories/asset_factory'
import { CourseFactory } from '#database/factories/course_factory'

export const PathFactory = factory
  .define(Path, ({ faker }) => ({
    name: faker.lorem.words({ min: 3, max: 6 }),
    description: faker.lorem.sentence(),
    state: States.DRAFT,
    isFeatured: faker.datatype.boolean(),
  }))
  .state('published', (path) => {
    path.state = States.PUBLIC
  })
  .state('draft', (path) => {
    path.state = States.DRAFT
  })
  .relation('owner', () => UserFactory)
  .relation('asset', () => AssetFactory)
  .relation('courses', () => CourseFactory)
  .build()
