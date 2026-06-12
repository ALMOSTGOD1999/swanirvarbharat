import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import type User from '#models/user'
import type Course from '#models/course'
import AppBasePolicy from '#policies/base_policy'

export default class CoursePolicy extends AppBasePolicy {
  viewList(_user: User): AuthorizerResponse {
    return true
  }

  view(_user: User, _course: Course): AuthorizerResponse {
    return true
  }

  create(user: User): AuthorizerResponse {
    return this.isContributor(user) || this.isAdmin(user)
  }

  update(user: User, course: Course): AuthorizerResponse {
    if (this.isAdmin(user)) return true
    return this.isOwner(user, course)
  }

  delete(user: User, course: Course): AuthorizerResponse {
    if (this.isAdmin(user)) return true
    return this.isOwner(user, course)
  }
}
