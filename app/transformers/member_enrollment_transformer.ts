import { BaseTransformer } from '@adonisjs/core/transformers'
import type MemberEnrollment from '#models/member_enrollment'
import UserTransformer from '#transformers/user_transformer'
import MemberEnrollmentEventTransformer from '#transformers/member_enrollment_event_transformer'

export default class MemberEnrollmentTransformer extends BaseTransformer<MemberEnrollment> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'userId',
        'resourceType',
        'resourceId',
        'status',
        'attemptNumber',
        'reason',
        'contextLinks',
        'videoSource',
        'videoFile',
        'videoUrl',
        'reviewerId',
        'reviewedAt',
        'rejectionReason',
        'revokedById',
        'revokedAt',
        'revocationReason',
        'createdAt',
        'updatedAt',
      ]),
      user: UserTransformer.transform(this.whenLoaded(this.resource.user)),
      reviewer: UserTransformer.transform(this.whenLoaded(this.resource.reviewer)),
      revokedBy: UserTransformer.transform(this.whenLoaded(this.resource.revokedBy)),
      events: MemberEnrollmentEventTransformer.transform(this.whenLoaded(this.resource.events)),
    }
  }
}
