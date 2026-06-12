import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import type User from '#models/user'
import type Series from '#models/series'
import AppBasePolicy from '#policies/base_policy'

export default class SeriesPolicy extends AppBasePolicy {
  viewList(_user: User): AuthorizerResponse {
    return true
  }

  view(_user: User, _series: Series): AuthorizerResponse {
    return true
  }

  create(user: User): AuthorizerResponse {
    return this.isContributor(user) || this.isAdmin(user)
  }

  update(user: User, series: Series): AuthorizerResponse {
    if (this.isAdmin(user)) return true
    return this.isOwner(user, series)
  }

  delete(user: User, series: Series): AuthorizerResponse {
    if (this.isAdmin(user)) return true
    return this.isOwner(user, series)
  }
}
