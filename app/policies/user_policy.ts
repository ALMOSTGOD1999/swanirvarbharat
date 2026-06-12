import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import type User from '#models/user'
import AppBasePolicy from '#policies/base_policy'

export default class UserPolicy extends AppBasePolicy {
  viewList(user: User): AuthorizerResponse {
    return this.isAdmin(user) || this.isContributorLvl2(user)
  }

  view(user: User, target: User): AuthorizerResponse {
    if (this.isAdmin(user)) return true
    return user.id === target.id
  }

  create(user: User): AuthorizerResponse {
    return this.isAdmin(user)
  }

  update(user: User, target: User): AuthorizerResponse {
    if (this.isAdmin(user)) return true
    return user.id === target.id
  }

  delete(user: User, target: User): AuthorizerResponse {
    return this.isAdmin(user) && user.id !== target.id
  }
}
