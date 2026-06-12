import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import type User from '#models/user'
import AppBasePolicy from '#policies/base_policy'

export default class CommentPolicy extends AppBasePolicy {
  viewList(_user: User): AuthorizerResponse {
    return true
  }

  create(user: User): AuthorizerResponse {
    return !!user
  }

  update(user: User, comment: { userId?: string | null }): AuthorizerResponse {
    if (this.isAdmin(user)) return true
    return this.isOwner(user, comment)
  }

  delete(user: User, comment: { userId?: string | null }): AuthorizerResponse {
    if (this.isAdmin(user)) return true
    return this.isOwner(user, comment)
  }
}
