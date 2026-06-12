import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import type User from '#models/user'
import AppBasePolicy from '#policies/base_policy'

export default class RolePolicy extends AppBasePolicy {
  viewList(user: User): AuthorizerResponse {
    return this.isAdmin(user)
  }

  view(user: User): AuthorizerResponse {
    return this.isAdmin(user)
  }

  create(user: User): AuthorizerResponse {
    return this.isAdmin(user)
  }

  update(user: User): AuthorizerResponse {
    return this.isAdmin(user)
  }

  delete(user: User): AuthorizerResponse {
    return this.isAdmin(user)
  }
}
