import factory from '@adonisjs/lucid/factories'
import { States } from '#enums/states'
import CourseModule from '#models/course_module'

export const CourseModuleFactory = factory
  .define(CourseModule, ({ faker }) => ({
    name: faker.lorem.words({ min: 2, max: 5 }),
    notes: faker.lorem.sentence(),
    state: States.DRAFT,
    sortOrder: 0,
  }))
  .state('published', (mod) => {
    mod.state = States.PUBLIC
  })
  .build()
