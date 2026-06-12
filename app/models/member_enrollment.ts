import { compose } from '@adonisjs/core/helpers'
import { belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { attachment } from '@jrmc/adonis-attachment'
import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'
import { MemberEnrollmentSchema } from '#database/schema'
import { withID } from '#utils/with_id_mixin'
import User from '#models/user'
import MemberEnrollmentEvent from '#models/member_enrollment_event'
import type {
  MemberEnrollmentResourceType,
  MemberEnrollmentStatusType,
  MemberEnrollmentVideoSourceType,
} from '#enums/member_enrollments'

export default class MemberEnrollment extends compose(MemberEnrollmentSchema, withID) {
  @column()
  declare status: MemberEnrollmentStatusType
  @column()
  declare resourceType: MemberEnrollmentResourceType
  @column()
  declare videoSource: MemberEnrollmentVideoSourceType

  @attachment({ preComputeUrl: true, folder: 'member-enrollment-videos', meta: true })
  declare videoFile: Attachment | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
  @belongsTo(() => User, { foreignKey: 'reviewerId' })
  declare reviewer: BelongsTo<typeof User>
  @belongsTo(() => User, { foreignKey: 'revokedById' })
  declare revokedBy: BelongsTo<typeof User>
  @hasMany(() => MemberEnrollmentEvent)
  declare events: HasMany<typeof MemberEnrollmentEvent>
}
