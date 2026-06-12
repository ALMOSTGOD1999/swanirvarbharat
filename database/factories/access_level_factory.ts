import factory from '@adonisjs/lucid/factories'
import AccessLevel from '#models/access_level'

export const AccessLevelFactory = factory
  .define(AccessLevel, ({ faker }) => ({
    name: faker.helpers.arrayElement(['Free', 'One-Time Purchase', 'Subscription', 'Internal']),
    color: faker.helpers.arrayElement(['#10b981', '#3b82f6', '#f59e0b', '#6366f1']),
    sortOrder: faker.number.int({ min: 0, max: 10 }),
    isDefault: false,
  }))
  .state('free', (al) => {
    al.name = 'Free'
    al.color = '#10b981'
    al.isDefault = true
  })
  .state('oneTime', (al) => {
    al.name = 'One-Time Purchase'
    al.color = '#3b82f6'
  })
  .state('subscription', (al) => {
    al.name = 'Subscription'
    al.color = '#f59e0b'
  })
  .state('internal', (al) => {
    al.name = 'Internal'
    al.color = '#6366f1'
  })
  .build()
