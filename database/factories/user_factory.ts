import factory from '@adonisjs/lucid/factories'

import { Roles } from '#enums/roles'
import { PostFactory } from '#database/factories/post_factory'
import User from '#models/user'
import { ProfileFactory } from '#database/factories/profile_factory'

export const UserFactory = factory
  .define(User, ({ faker }) => ({
    roleId: Roles.USER,
    email: faker.internet.email(),
    username: faker.internet.username(),
    password: faker.internet.password(),
  }))
  .state('admin', (user) => (user.roleId = Roles.ADMIN))
  .state('contributorLvl1', (user) => (user.roleId = Roles.CONTRIBUTOR_LVL_1))
  .state('contributorLvl2', (user) => (user.roleId = Roles.CONTRIBUTOR_LVL_2))
  .relation('posts', () => PostFactory)
  .relation('profile', () => ProfileFactory)
  .build()
