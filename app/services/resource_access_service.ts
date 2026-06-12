import { AccessLevels } from '#enums/access_levels'
import { MemberEnrollmentStatuses } from '#enums/member_enrollments'
import MemberEnrollmentService, {
  type EnrollmentResource,
  type EnrollmentSummary,
} from '#services/member_enrollment_service'
import type User from '#models/user'

export type ResourceAccessReason =
  | 'public'
  | 'approved'
  | 'admin'
  | 'owner'
  | 'auth-required'
  | 'admin-only'
  | 'member-approval-required'
  | 'pending'
  | 'rejected'
  | 'revoked'

export type ResourceAccessDto = {
  allowed: boolean
  levelName: string
  reason: ResourceAccessReason
  enrollment?: EnrollmentSummary
}

export default class ResourceAccessService {
  static async forResource(
    resource: EnrollmentResource,
    user?: User | null
  ): Promise<ResourceAccessDto> {
    const levelName = resource.model.accessLevel?.name ?? AccessLevels.FREE

    if (levelName === AccessLevels.FREE) return { allowed: true, levelName, reason: 'public' }
    if (user?.isAdmin) return { allowed: true, levelName, reason: 'admin' }
    if (user && resource.model.ownerId === user.id)
      return { allowed: true, levelName, reason: 'owner' }

    if (levelName === AccessLevels.INTERNAL) {
      return { allowed: false, levelName, reason: 'admin-only' }
    }

    if (levelName !== AccessLevels.MEMBER) {
      return { allowed: Boolean(user), levelName, reason: user ? 'approved' : 'auth-required' }
    }

    const enrollment = await MemberEnrollmentService.summaryFor(user, resource)
    if (!user) return { allowed: false, levelName, reason: 'auth-required', enrollment }
    if (enrollment.enrollment?.status === MemberEnrollmentStatuses.APPROVED) {
      return { allowed: true, levelName, reason: 'approved', enrollment }
    }
    if (enrollment.enrollment?.status === MemberEnrollmentStatuses.PENDING) {
      return { allowed: false, levelName, reason: 'pending', enrollment }
    }
    if (enrollment.enrollment?.status === MemberEnrollmentStatuses.REJECTED) {
      return { allowed: false, levelName, reason: 'rejected', enrollment }
    }
    if (enrollment.enrollment?.status === MemberEnrollmentStatuses.REVOKED) {
      return { allowed: false, levelName, reason: 'revoked', enrollment }
    }

    return { allowed: false, levelName, reason: 'member-approval-required', enrollment }
  }
}
