import factory from '@adonisjs/lucid/factories'
import Comment from '#models/comment'
import { UserFactory } from '#database/factories/user_factory'

export const CommentFactory = factory
  .define(Comment, ({ faker }) => ({
    body: faker.lorem.paragraph(),
    identity: faker.string.uuid(),
    levelIndex: 0,
  }))
  .relation('user', () => UserFactory)
  .build()
