import { BaseTransformer } from '@adonisjs/core/transformers'
import type MemberEnrollmentEvent from '#models/member_enrollment_event'
import UserTransformer from '#transformers/user_transformer'

export default class MemberEnrollmentEventTransformer extends BaseTransformer<MemberEnrollmentEvent> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'eventType',
        'fromStatus',
        'toStatus',
        'note',
        'snapshot',
        'createdAt',
      ]),
      actor: UserTransformer.transform(this.whenLoaded(this.resource.actor)),
    }
  }
}
