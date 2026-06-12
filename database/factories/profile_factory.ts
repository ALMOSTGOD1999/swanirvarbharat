import factory from '@adonisjs/lucid/factories'

import { UserFactory } from '#database/factories/user_factory'
import Profile from '#models/profile'

export const ProfileFactory = factory
  .define(Profile, async ({ faker }) => {
    return {
      biography: faker.lorem.paragraph(),
      location: faker.location.state() + ', ' + faker.location.country(),
      website: faker.internet.url(),
      name: faker.person.fullName(),
    }
  })
  .relation('user', () => UserFactory)
  .build()
