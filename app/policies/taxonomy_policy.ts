import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import type User from '#models/user'
import type Taxonomy from '#models/taxonomy'
import AppBasePolicy from '#policies/base_policy'

export default class TaxonomyPolicy extends AppBasePolicy {
  viewList(_user: User): AuthorizerResponse {
    return true
  }

  view(_user: User, _taxonomy: Taxonomy): AuthorizerResponse {
    return true
  }

  create(user: User): AuthorizerResponse {
    return this.isContributor(user) || this.isAdmin(user)
  }

  update(user: User, taxonomy: Taxonomy): AuthorizerResponse {
    if (this.isAdmin(user)) return true
    return this.isOwner(user, taxonomy)
  }

  delete(user: User): AuthorizerResponse {
    return this.isAdmin(user)
  }
}
