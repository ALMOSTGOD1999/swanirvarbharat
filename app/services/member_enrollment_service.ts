import { Exception } from '@adonisjs/core/exceptions'
import { DateTime } from 'luxon'
import attachmentManager from '@jrmc/adonis-attachment/services/main'
import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'
import edge from 'edge.js'
import mail from '@adonisjs/mail/services/main'

import {
  MemberEnrollmentEventTypes,
  MemberEnrollmentResourceTypes,
  MemberEnrollmentStatuses,
  MemberEnrollmentVideoSources,
  type MemberEnrollmentResourceType,
  type MemberEnrollmentStatusType,
  type MemberEnrollmentVideoSourceType,
} from '#enums/member_enrollments'
import Course from '#models/course'
import MemberEnrollment from '#models/member_enrollment'
import MemberEnrollmentEvent from '#models/member_enrollment_event'
import Series from '#models/series'
import User from '#models/user'

export type EnrollmentResource =
  | { type: typeof MemberEnrollmentResourceTypes.COURSE; model: Course }
  | { type: typeof MemberEnrollmentResourceTypes.SERIES; model: Series }

export type EnrollmentPayload = {
  reason: string
  contextLinks?: string[]
  videoSource: MemberEnrollmentVideoSourceType
  videoUrl?: string | null
  videoFile?: Attachment | null
}

export type EnrollmentSummary = {
  enrollment: MemberEnrollment | null
  attemptsUsed: number
  attemptsRemaining: number
  maxAttempts: number
  canApply: boolean
}

export type EnrollmentResourceSummary = {
  type: MemberEnrollmentResourceType
  id: string
  title: string
  slug: string
  url: string
}

function resourceId(resource: EnrollmentResource) {
  return resource.model.id
}

function resourceAttemptLimit(resource: EnrollmentResource) {
  return resource.model.enrollmentAttemptLimit || 3
}

function assertValidVideoPayload(payload: EnrollmentPayload) {
  const hasFile = Boolean(payload.videoFile)
  const hasUrl = Boolean(payload.videoUrl)

  if (payload.videoSource === MemberEnrollmentVideoSources.FILE && !hasFile) {
    throw new Exception('Please upload a short video before submitting.', { status: 422 })
  }

  if (payload.videoSource === MemberEnrollmentVideoSources.URL && !hasUrl) {
    throw new Exception('Please provide a HTTPS video URL before submitting.', { status: 422 })
  }

  if (hasFile && hasUrl) {
    throw new Exception('Use either an uploaded video or a video URL, not both.', { status: 422 })
  }
}

async function createEvent(
  enrollment: MemberEnrollment,
  actor: User,
  eventType: (typeof MemberEnrollmentEventTypes)[keyof typeof MemberEnrollmentEventTypes],
  fromStatus: MemberEnrollmentStatusType | null,
  toStatus: MemberEnrollmentStatusType,
  note?: string | null
) {
  await MemberEnrollmentEvent.create({
    memberEnrollmentId: enrollment.id,
    actorId: actor.id,
    eventType,
    fromStatus,
    toStatus,
    note: note ?? null,
    snapshot: {
      reason: enrollment.reason,
      contextLinks: enrollment.contextLinks,
      videoSource: enrollment.videoSource,
      videoUrl: enrollment.videoUrl,
    },
  })
}

async function sendDecisionEmail(
  enrollment: MemberEnrollment,
  resource: EnrollmentResource,
  decision: 'approved' | 'rejected'
) {
  const user = enrollment.user ?? (await User.findOrFail(enrollment.userId))
  const resourceSummary = MemberEnrollmentService.resourceSummary(resource)
  const html = await edge.render(`emails/member_enrollment_${decision}`, {
    user,
    enrollment,
    resource: resourceSummary,
  })

  await mail.send((message) => {
    message
      .to(user.email)
      .subject(
        decision === 'approved'
          ? `[Swanirvarbharat] Your ${resourceSummary.type} enrollment was approved`
          : `[Swanirvarbharat] Your ${resourceSummary.type} enrollment needs changes`
      )
      .html(html)
  })
}

export default class MemberEnrollmentService {
  static async courseBySlug(slug: string): Promise<EnrollmentResource> {
    const course = await Course.query()
      .where('slug', slug)
      .preload('owner')
      .preload('accessLevel')
      .firstOrFail()

    return { type: MemberEnrollmentResourceTypes.COURSE, model: course }
  }

  static async seriesBySlug(slug: string): Promise<EnrollmentResource> {
    const series = await Series.query()
      .where('slug', slug)
      .preload('owner')
      .preload('accessLevel')
      .firstOrFail()

    return { type: MemberEnrollmentResourceTypes.SERIES, model: series }
  }

  static async enrollmentById(id: string) {
    return MemberEnrollment.query()
      .where('id', id)
      .preload('user')
      .preload('reviewer')
      .preload('revokedBy')
      .preload('events', (query) => query.preload('actor').orderBy('createdAt', 'desc'))
      .firstOrFail()
  }

  static async resourceForEnrollment(enrollment: MemberEnrollment): Promise<EnrollmentResource> {
    if (enrollment.resourceType === MemberEnrollmentResourceTypes.COURSE) {
      const course = await Course.query()
        .where('id', enrollment.resourceId)
        .preload('owner')
        .preload('accessLevel')
        .firstOrFail()
      return { type: MemberEnrollmentResourceTypes.COURSE, model: course }
    }

    const series = await Series.query()
      .where('id', enrollment.resourceId)
      .preload('owner')
      .preload('accessLevel')
      .firstOrFail()
    return { type: MemberEnrollmentResourceTypes.SERIES, model: series }
  }

  static resourceSummary(resource: EnrollmentResource): EnrollmentResourceSummary {
    if (resource.type === MemberEnrollmentResourceTypes.COURSE) {
      return {
        type: resource.type,
        id: resource.model.id,
        title: resource.model.name,
        slug: resource.model.slug,
        url: `/courses/${resource.model.slug}`,
      }
    }

    return {
      type: resource.type,
      id: resource.model.id,
      title: resource.model.name,
      slug: resource.model.slug,
      url: `/series/${resource.model.slug}`,
    }
  }

  static async listForUser(user: User) {
    return MemberEnrollment.query()
      .where('userId', user.id)
      .preload('reviewer')
      .orderBy('createdAt', 'desc')
  }

  static async listForReview(
    status?: MemberEnrollmentStatusType,
    resourceType?: MemberEnrollmentResourceType
  ) {
    const query = MemberEnrollment.query()
      .preload('user')
      .preload('reviewer')
      .preload('revokedBy')
      .orderBy('createdAt', 'desc')

    if (status) query.where('status', status)
    if (resourceType) query.where('resourceType', resourceType)

    return query
  }

  static async currentEnrollment(user: User | null | undefined, resource: EnrollmentResource) {
    if (!user) return null

    return MemberEnrollment.query()
      .where('userId', user.id)
      .where('resourceType', resource.type)
      .where('resourceId', resourceId(resource))
      .orderBy('attemptNumber', 'desc')
      .orderBy('createdAt', 'desc')
      .first()
  }

  static async summaryFor(
    user: User | null | undefined,
    resource: EnrollmentResource
  ): Promise<EnrollmentSummary> {
    const maxAttempts = resourceAttemptLimit(resource)

    if (!user) {
      return {
        enrollment: null,
        attemptsUsed: 0,
        attemptsRemaining: maxAttempts,
        maxAttempts,
        canApply: false,
      }
    }

    const enrollments = await MemberEnrollment.query()
      .where('userId', user.id)
      .where('resourceType', resource.type)
      .where('resourceId', resourceId(resource))
      .orderBy('attemptNumber', 'desc')
      .orderBy('createdAt', 'desc')

    const enrollment = enrollments[0] ?? null
    const attemptsUsed = enrollments.reduce((max, item) => Math.max(max, item.attemptNumber), 0)
    const attemptsRemaining = Math.max(0, maxAttempts - attemptsUsed)
    const canApply =
      !enrollment ||
      enrollment.status === MemberEnrollmentStatuses.PENDING ||
      (enrollment.status === MemberEnrollmentStatuses.REJECTED && attemptsRemaining > 0) ||
      (enrollment.status === MemberEnrollmentStatuses.REVOKED && attemptsRemaining > 0)

    return { enrollment, attemptsUsed, attemptsRemaining, maxAttempts, canApply }
  }

  static async hasApprovedEnrollment(user: User | null | undefined, resource: EnrollmentResource) {
    if (!user) return false

    const enrollment = await MemberEnrollment.query()
      .where('userId', user.id)
      .where('resourceType', resource.type)
      .where('resourceId', resourceId(resource))
      .where('status', MemberEnrollmentStatuses.APPROVED)
      .first()

    return Boolean(enrollment)
  }

  static canReview(user: User, resource: EnrollmentResource) {
    return Boolean(user.isAdmin || resource.model.ownerId === user.id)
  }

  static async submitOrUpdate(
    user: User,
    resource: EnrollmentResource,
    payload: EnrollmentPayload
  ) {
    assertValidVideoPayload(payload)

    const current = await this.currentEnrollment(user, resource)
    if (current?.status === MemberEnrollmentStatuses.APPROVED) {
      throw new Exception('You are already approved for this resource.', { status: 422 })
    }

    const summary = await this.summaryFor(user, resource)
    const isPendingEdit = current?.status === MemberEnrollmentStatuses.PENDING
    if (!isPendingEdit && summary.attemptsRemaining <= 0) {
      throw new Exception('You have reached the maximum number of enrollment attempts.', {
        status: 422,
      })
    }

    const enrollment = current && isPendingEdit ? current : new MemberEnrollment()
    const previousStatus = current?.status ?? null
    const previousFile = enrollment.videoFile

    if (!current || !isPendingEdit) {
      enrollment.userId = user.id
      enrollment.resourceType = resource.type
      enrollment.resourceId = resourceId(resource)
      enrollment.attemptNumber = summary.attemptsUsed + 1
      enrollment.status = MemberEnrollmentStatuses.PENDING
    }

    enrollment.reason = payload.reason
    enrollment.contextLinks = payload.contextLinks ?? []
    enrollment.videoSource = payload.videoSource
    enrollment.videoUrl =
      payload.videoSource === MemberEnrollmentVideoSources.URL ? (payload.videoUrl ?? null) : null
    if (payload.videoSource === MemberEnrollmentVideoSources.FILE)
      enrollment.videoFile = payload.videoFile ?? null
    if (payload.videoSource === MemberEnrollmentVideoSources.URL) enrollment.videoFile = null
    enrollment.rejectionReason = null
    enrollment.reviewedAt = null
    enrollment.reviewerId = null
    enrollment.revokedAt = null
    enrollment.revokedById = null
    enrollment.revocationReason = null

    await enrollment.save()

    if (previousFile && payload.videoFile && previousFile !== payload.videoFile) {
      await attachmentManager.remove(previousFile)
    }

    await createEvent(
      enrollment,
      user,
      isPendingEdit ? MemberEnrollmentEventTypes.UPDATED : MemberEnrollmentEventTypes.SUBMITTED,
      previousStatus,
      enrollment.status
    )

    return enrollment
  }

  static async approve(reviewer: User, enrollment: MemberEnrollment) {
    const previousStatus = enrollment.status
    enrollment.status = MemberEnrollmentStatuses.APPROVED
    enrollment.reviewerId = reviewer.id
    enrollment.reviewedAt = DateTime.now()
    enrollment.rejectionReason = null
    await enrollment.save()
    await createEvent(
      enrollment,
      reviewer,
      MemberEnrollmentEventTypes.APPROVED,
      previousStatus,
      enrollment.status
    )
    await sendDecisionEmail(enrollment, await this.resourceForEnrollment(enrollment), 'approved')
    return enrollment
  }

  static async reject(reviewer: User, enrollment: MemberEnrollment, reason: string) {
    const previousStatus = enrollment.status
    enrollment.status = MemberEnrollmentStatuses.REJECTED
    enrollment.reviewerId = reviewer.id
    enrollment.reviewedAt = DateTime.now()
    enrollment.rejectionReason = reason
    await enrollment.save()
    await createEvent(
      enrollment,
      reviewer,
      MemberEnrollmentEventTypes.REJECTED,
      previousStatus,
      enrollment.status,
      reason
    )
    await sendDecisionEmail(enrollment, await this.resourceForEnrollment(enrollment), 'rejected')
    return enrollment
  }

  static async revoke(reviewer: User, enrollment: MemberEnrollment, reason?: string | null) {
    const previousStatus = enrollment.status
    enrollment.status = MemberEnrollmentStatuses.REVOKED
    enrollment.revokedById = reviewer.id
    enrollment.revokedAt = DateTime.now()
    enrollment.revocationReason = reason ?? null
    await enrollment.save()
    await createEvent(
      enrollment,
      reviewer,
      MemberEnrollmentEventTypes.REVOKED,
      previousStatus,
      enrollment.status,
      reason
    )
    return enrollment
  }
}

export const isPendingStatus = (status: string) => status === MemberEnrollmentStatuses.PENDING
