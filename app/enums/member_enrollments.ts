export const MemberEnrollmentStatuses = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REVOKED: 'revoked',
} as const

export const MemberEnrollmentResourceTypes = {
  COURSE: 'course',
  SERIES: 'series',
} as const

export const MemberEnrollmentVideoSources = {
  FILE: 'file',
  URL: 'url',
} as const

export const MemberEnrollmentEventTypes = {
  SUBMITTED: 'submitted',
  UPDATED: 'updated',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REVOKED: 'revoked',
} as const

export type MemberEnrollmentStatusType =
  (typeof MemberEnrollmentStatuses)[keyof typeof MemberEnrollmentStatuses]
export type MemberEnrollmentResourceType =
  (typeof MemberEnrollmentResourceTypes)[keyof typeof MemberEnrollmentResourceTypes]
export type MemberEnrollmentVideoSourceType =
  (typeof MemberEnrollmentVideoSources)[keyof typeof MemberEnrollmentVideoSources]
export type MemberEnrollmentEventType =
  (typeof MemberEnrollmentEventTypes)[keyof typeof MemberEnrollmentEventTypes]
