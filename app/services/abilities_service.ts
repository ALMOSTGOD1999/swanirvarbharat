import type User from '#models/user'

import PostPolicy from '#policies/post_policy'
import TaxonomyPolicy from '#policies/taxonomy_policy'
import UserPolicy from '#policies/user_policy'
import RolePolicy from '#policies/role_policy'
import CommentPolicy from '#policies/comment_policy'
import DiscussionPolicy from '#policies/discussion_policy'
import AssetPolicy from '#policies/asset_policy'
import CoursePolicy from '#policies/course_policy'
import SeriesPolicy from '#policies/series_policy'
import PlaylistPolicy from '#policies/playlist_policy'
import PathPolicy from '#policies/path_policy'
import AccessLevelPolicy from '#policies/access_level_policy'

import { type AuthorizerResponse } from '@adonisjs/bouncer/types'
import { type MongoQuery } from '@casl/ability'

export type Subjects =
  | 'post'
  | 'taxonomy'
  | 'user'
  | 'role'
  | 'comment'
  | 'discussion'
  | 'asset'
  | 'course'
  | 'series'
  | 'playlist'
  | 'path'
  | 'accessLevel'

export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage'

export type Rule = {
  action: Actions
  subject: Subjects
  fields?: string[]
  conditions?: MongoQuery<Record<string, any>>
}

export default class AbilitiesService {
  private rules: Rule[] = []

  private addRuleIf(
    ok: AuthorizerResponse,
    action: Rule['action'],
    subject: Rule['subject'],
    fields?: string[],
    conditions?: Rule['conditions']
  ) {
    if (ok) this.rules.push({ action, subject, fields, conditions })
  }

  public async getAllAbilities(user: User) {
    this.rules = []

    // ----- post
    const postPolicy = new PostPolicy()
    this.addRuleIf(postPolicy.viewList(user), 'read', 'post')
    this.addRuleIf(postPolicy.create(user), 'create', 'post')
    this.addRuleIf(postPolicy.update(user), 'update', 'post')
    this.addRuleIf(postPolicy.delete(user), 'delete', 'post')

    // ----- taxonomy
    const taxonomyPolicy = new TaxonomyPolicy()
    this.addRuleIf(taxonomyPolicy.viewList(user), 'read', 'taxonomy')
    this.addRuleIf(taxonomyPolicy.create(user), 'create', 'taxonomy')
    this.addRuleIf(taxonomyPolicy.update(user, { ownerId: user.id } as any), 'update', 'taxonomy')
    this.addRuleIf(taxonomyPolicy.delete(user), 'delete', 'taxonomy')

    // ----- user
    const userPolicy = new UserPolicy()
    this.addRuleIf(userPolicy.viewList(user), 'read', 'user')
    this.addRuleIf(userPolicy.create(user), 'create', 'user')
    this.addRuleIf(userPolicy.update(user, user), 'update', 'user')
    this.addRuleIf(userPolicy.delete(user, user), 'delete', 'user')

    // ----- role
    const rolePolicy = new RolePolicy()
    this.addRuleIf(rolePolicy.viewList(user), 'read', 'role')
    this.addRuleIf(rolePolicy.create(user), 'create', 'role')
    this.addRuleIf(rolePolicy.update(user), 'update', 'role')
    this.addRuleIf(rolePolicy.delete(user), 'delete', 'role')

    // ----- comment
    const commentPolicy = new CommentPolicy()
    this.addRuleIf(commentPolicy.viewList(user), 'read', 'comment')
    this.addRuleIf(commentPolicy.create(user), 'create', 'comment')
    this.addRuleIf(commentPolicy.update(user, { userId: user.id }), 'update', 'comment')
    this.addRuleIf(commentPolicy.delete(user, { userId: user.id }), 'delete', 'comment')

    // ----- discussion
    const discussionPolicy = new DiscussionPolicy()
    this.addRuleIf(discussionPolicy.viewList(user), 'read', 'discussion')
    this.addRuleIf(discussionPolicy.create(user), 'create', 'discussion')
    this.addRuleIf(discussionPolicy.update(user, { userId: user.id }), 'update', 'discussion')
    this.addRuleIf(discussionPolicy.delete(user, { userId: user.id }), 'delete', 'discussion')

    // ----- asset
    const assetPolicy = new AssetPolicy()
    this.addRuleIf(assetPolicy.viewList(user), 'read', 'asset')
    this.addRuleIf(assetPolicy.create(user), 'create', 'asset')
    this.addRuleIf(assetPolicy.delete(user), 'delete', 'asset')

    // ----- course
    const coursePolicy = new CoursePolicy()
    this.addRuleIf(coursePolicy.viewList(user), 'read', 'course')
    this.addRuleIf(coursePolicy.create(user), 'create', 'course')
    this.addRuleIf(coursePolicy.update(user, {} as any), 'update', 'course')
    this.addRuleIf(coursePolicy.delete(user, {} as any), 'delete', 'course')

    // ----- series
    const seriesPolicy = new SeriesPolicy()
    this.addRuleIf(seriesPolicy.viewList(user), 'read', 'series')
    this.addRuleIf(seriesPolicy.create(user), 'create', 'series')
    this.addRuleIf(seriesPolicy.update(user, {} as any), 'update', 'series')
    this.addRuleIf(seriesPolicy.delete(user, {} as any), 'delete', 'series')

    // ----- playlist
    const playlistPolicy = new PlaylistPolicy()
    this.addRuleIf(playlistPolicy.viewList(user), 'read', 'playlist')
    this.addRuleIf(playlistPolicy.create(user), 'create', 'playlist')
    this.addRuleIf(playlistPolicy.update(user, {} as any), 'update', 'playlist')
    this.addRuleIf(playlistPolicy.delete(user, {} as any), 'delete', 'playlist')

    // ----- path
    const pathPolicy = new PathPolicy()
    this.addRuleIf(pathPolicy.viewList(user), 'read', 'path')
    this.addRuleIf(pathPolicy.create(user), 'create', 'path')
    this.addRuleIf(pathPolicy.update(user, {} as any), 'update', 'path')
    this.addRuleIf(pathPolicy.delete(user, {} as any), 'delete', 'path')

    // ----- access level
    const accessLevelPolicy = new AccessLevelPolicy()
    this.addRuleIf(accessLevelPolicy.viewList(user), 'read', 'accessLevel')
    this.addRuleIf(accessLevelPolicy.create(user), 'create', 'accessLevel')
    this.addRuleIf(accessLevelPolicy.update(user, {} as any), 'update', 'accessLevel')
    this.addRuleIf(accessLevelPolicy.delete(user, {} as any), 'delete', 'accessLevel')

    return this.rules
  }
}
