import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import type User from '#models/user'
import type Path from '#models/path'
import AppBasePolicy from '#policies/base_policy'

export default class PathPolicy extends AppBasePolicy {
  viewList(_user: User): AuthorizerResponse {
    return true
  }

  view(_user: User, _path: Path): AuthorizerResponse {
    return true
  }

  create(user: User): AuthorizerResponse {
    return this.isContributor(user) || this.isAdmin(user)
  }

  update(user: User, path: Path): AuthorizerResponse {
    if (this.isAdmin(user)) return true
    return this.isOwner(user, path)
  }

  delete(user: User, path: Path): AuthorizerResponse {
    if (this.isAdmin(user)) return true
    return this.isOwner(user, path)
  }
}
