import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import type User from '#models/user'
import AppBasePolicy from '#policies/base_policy'

export default class AssetPolicy extends AppBasePolicy {
  viewList(user: User): AuthorizerResponse {
    return this.isContributor(user) || this.isAdmin(user)
  }

  create(user: User): AuthorizerResponse {
    return this.isContributor(user) || this.isAdmin(user)
  }

  delete(user: User): AuthorizerResponse {
    return this.isAdmin(user)
  }
}
