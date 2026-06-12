import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import type User from '#models/user'
import AppBasePolicy from '#policies/base_policy'

export default class DiscussionPolicy extends AppBasePolicy {
  viewList(_user: User): AuthorizerResponse {
    return true
  }

  view(_user: User): AuthorizerResponse {
    return true
  }

  create(user: User): AuthorizerResponse {
    return !!user
  }

  update(user: User, discussion: { userId?: string }): AuthorizerResponse {
    if (this.isAdmin(user)) return true
    return this.isOwner(user, discussion)
  }

  delete(user: User, discussion: { userId?: string }): AuthorizerResponse {
    if (this.isAdmin(user)) return true
    return this.isOwner(user, discussion)
  }
}
