import factory from '@adonisjs/lucid/factories'
import { States } from '#enums/states'
import { Difficulties } from '#enums/difficulties'
import Course from '#models/course'
import { UserFactory } from '#database/factories/user_factory'
import { AssetFactory } from '#database/factories/asset_factory'
import { AccessLevelFactory } from '#database/factories/access_level_factory'
import { TaxonomyFactory } from '#database/factories/taxonomy_factory'

export const CourseFactory = factory
  .define(Course, ({ faker }) => ({
    name: faker.lorem.words({ min: 3, max: 6 }),
    description: faker.lorem.sentence(),
    state: States.DRAFT,
    difficulty: faker.helpers.arrayElement(Object.values(Difficulties)),
    isFeatured: faker.datatype.boolean(),
    pageTitle: faker.lorem.words(5),
    metaDescription: faker.lorem.sentence(),
  }))
  .state('published', (course) => {
    course.state = States.PUBLIC
  })
  .state('draft', (course) => {
    course.state = States.DRAFT
  })
  .state('featured', (course) => {
    course.isFeatured = true
  })
  .relation('owner', () => UserFactory)
  .relation('asset', () => AssetFactory)
  .relation('accessLevel', () => AccessLevelFactory)
  .relation('taxonomies', () => TaxonomyFactory)
  .build()
