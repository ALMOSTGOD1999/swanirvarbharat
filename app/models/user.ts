import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { belongsTo, computed, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import { attachment } from '@jrmc/adonis-attachment'

import type { BelongsTo, HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'

import { UserSchema } from '#database/schema'
import { Roles } from '#enums/roles'
import Post from '#models/post'
import Role from '#models/role'
import SessionLog from '#models/session_log'
import { withID } from '#utils/with_id_mixin'
import Profile from '#models/profile'
import Comment from '#models/comment'
import Discussion from '#models/discussion'
import { LessonPanels, type LessonPanel } from '#enums/lesson_panels'

const withAuth = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email', 'username'],
  passwordColumnName: 'password',
})

export default class User extends compose(UserSchema, withAuth, withID) {
  @attachment()
  declare avatar: Attachment

  declare defaultLessonPanel: LessonPanel

  declare isEnabledAutoplayNext: boolean

  get resolvedDefaultLessonPanel() {
    return this.defaultLessonPanel || LessonPanels.OVERVIEW
  }

  @computed()
  get handle() {
    return `@${this.username}`
  }

  @computed()
  get memberDuration() {
    if (!this.createdAt) return
    return this.createdAt.toRelative()
  }

  @computed()
  get isAdmin() {
    return this.roleId === Roles.ADMIN
  }

  @computed()
  get isContributor() {
    return [Roles.CONTRIBUTOR_LVL_1, Roles.CONTRIBUTOR_LVL_2].includes(this.roleId)
  }

  @computed()
  get isEmailVerified() {
    return !!this.emailVerifiedAt
  }

  // Relations
  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @manyToMany(() => Post, {
    pivotTable: 'author_posts',
    pivotColumns: ['author_type_id'],
  })
  declare posts: ManyToMany<typeof Post>

  @hasMany(() => SessionLog)
  declare sessions: HasMany<typeof SessionLog>

  @hasOne(() => Profile, {
    foreignKey: 'id',
    localKey: 'id',
  })
  declare profile: HasOne<typeof Profile>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @manyToMany(() => Comment, {
    pivotTable: 'comment_votes',
  })
  declare commentVotes: ManyToMany<typeof Comment>

  @hasMany(() => Discussion)
  declare discussions: HasMany<typeof Discussion>

  @manyToMany(() => Discussion, {
    pivotTable: 'discussion_votes',
  })
  declare discussionVotes: ManyToMany<typeof Discussion>
}
