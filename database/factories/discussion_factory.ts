import factory from '@adonisjs/lucid/factories'
import Discussion from '#models/discussion'
import { UserFactory } from '#database/factories/user_factory'

export const DiscussionFactory = factory
  .define(Discussion, ({ faker }) => ({
    title: faker.lorem.words({ min: 4, max: 10 }),
    body: faker.lorem.paragraphs({ min: 1, max: 4 }),
    views: faker.number.int({ min: 0, max: 500 }),
  }))
  .relation('user', () => UserFactory)
  .build()
