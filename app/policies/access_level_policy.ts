import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import type User from '#models/user'
import type AccessLevel from '#models/access_level'
import AppBasePolicy from '#policies/base_policy'

export default class AccessLevelPolicy extends AppBasePolicy {
  viewList(_user: User): AuthorizerResponse {
    return true
  }

  view(_user: User, _accessLevel: AccessLevel): AuthorizerResponse {
    return true
  }

  create(user: User): AuthorizerResponse {
    return this.isAdmin(user)
  }

  update(user: User, _accessLevel: AccessLevel): AuthorizerResponse {
    return this.isAdmin(user)
  }

  delete(user: User, _accessLevel: AccessLevel): AuthorizerResponse {
    return this.isAdmin(user)
  }
}
