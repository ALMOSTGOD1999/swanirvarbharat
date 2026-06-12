import vine from '@vinejs/vine'
import { baseFilter } from '#validators/common'
import {
  MemberEnrollmentResourceTypes,
  MemberEnrollmentStatuses,
  MemberEnrollmentVideoSources,
} from '#enums/member_enrollments'

export const memberEnrollmentIndexValidator = vine.create({
  ...baseFilter.getProperties(),
  status: vine.enum(Object.values(MemberEnrollmentStatuses)).optional(),
  resourceType: vine.enum(Object.values(MemberEnrollmentResourceTypes)).optional(),
})

const basePayload = {
  reason: vine.string().trim().minLength(10),
  contextLinks: vine.array(vine.string().trim().url()).optional(),
  videoSource: vine.enum(Object.values(MemberEnrollmentVideoSources)),
  videoUrl: vine
    .string()
    .trim()
    .url({ require_protocol: true })
    .regex(/^https:\/\//)
    .optional(),
}

export const submitMemberEnrollmentValidator = vine.create(basePayload)
export const updateMemberEnrollmentValidator = vine.create(basePayload)
export const rejectMemberEnrollmentValidator = vine.create({
  rejectionReason: vine.string().trim().minLength(3),
})
export const revokeMemberEnrollmentValidator = vine.create({
  revocationReason: vine.string().trim().optional(),
})
