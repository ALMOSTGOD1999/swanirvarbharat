import { compose } from '@adonisjs/core/helpers'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { MemberEnrollmentEventSchema } from '#database/schema'
import { withID } from '#utils/with_id_mixin'
import MemberEnrollment from '#models/member_enrollment'
import User from '#models/user'
import type {
  MemberEnrollmentEventType,
  MemberEnrollmentStatusType,
} from '#enums/member_enrollments'

export default class MemberEnrollmentEvent extends compose(MemberEnrollmentEventSchema, withID) {
  @column()
  declare eventType: MemberEnrollmentEventType
  @column()
  declare fromStatus: MemberEnrollmentStatusType | null
  @column()
  declare toStatus: MemberEnrollmentStatusType | null

  @belongsTo(() => MemberEnrollment)
  declare memberEnrollment: BelongsTo<typeof MemberEnrollment>
  @belongsTo(() => User, { foreignKey: 'actorId' })
  declare actor: BelongsTo<typeof User>
}
