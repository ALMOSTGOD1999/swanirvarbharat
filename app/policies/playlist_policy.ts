import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import type User from '#models/user'
import type Playlist from '#models/playlist'
import AppBasePolicy from '#policies/base_policy'

export default class PlaylistPolicy extends AppBasePolicy {
  viewList(_user: User): AuthorizerResponse {
    return true
  }

  view(_user: User, _playlist: Playlist): AuthorizerResponse {
    return true
  }

  create(user: User): AuthorizerResponse {
    return this.isContributor(user) || this.isAdmin(user)
  }

  update(user: User, playlist: Playlist): AuthorizerResponse {
    if (this.isAdmin(user)) return true
    return this.isOwner(user, playlist)
  }

  delete(user: User, playlist: Playlist): AuthorizerResponse {
    if (this.isAdmin(user)) return true
    return this.isOwner(user, playlist)
  }
}
