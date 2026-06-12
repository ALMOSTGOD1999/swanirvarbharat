import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import type User from '#models/user'
import AppBasePolicy from '#policies/base_policy'

export default class PostPolicy extends AppBasePolicy {
  viewList(_user: User): AuthorizerResponse {
    return true
  }

  view(_user: User): AuthorizerResponse {
    return true
  }

  create(user: User): AuthorizerResponse {
    return this.isContributor(user) || this.isAdmin(user)
  }

  update(user: User): AuthorizerResponse {
    return this.isContributor(user) || this.isAdmin(user)
  }

  delete(user: User): AuthorizerResponse {
    return this.isContributor(user) || this.isAdmin(user)
  }
}
