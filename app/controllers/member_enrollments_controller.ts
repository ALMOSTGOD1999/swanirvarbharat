import type { HttpContext } from '@adonisjs/core/http'
import attachmentManager from '@jrmc/adonis-attachment/services/main'

import { MemberEnrollmentVideoSources } from '#enums/member_enrollments'
import MemberEnrollmentService from '#services/member_enrollment_service'
import MemberEnrollmentTransformer from '#transformers/member_enrollment_transformer'
import { submitMemberEnrollmentValidator } from '#validators/member_enrollment'

export default class MemberEnrollmentsController {
  async index({ inertia, auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const enrollments = await MemberEnrollmentService.listForUser(user)
    const items = await Promise.all(
      enrollments.map(async (enrollment) => {
        const [serializedEnrollment, resource] = await Promise.all([
          serialize(MemberEnrollmentTransformer.transform(enrollment)),
          MemberEnrollmentService.resourceForEnrollment(enrollment),
        ])

        return {
          enrollment: serializedEnrollment.data,
          resource: MemberEnrollmentService.resourceSummary(resource),
        }
      })
    )

    return inertia.render('member_enrollments/index', { items })
  }

  async storeCourse(ctx: HttpContext) {
    const resource = await MemberEnrollmentService.courseBySlug(ctx.params.slug)
    return this.submit(ctx, resource)
  }

  async updateCourse(ctx: HttpContext) {
    const resource = await MemberEnrollmentService.courseBySlug(ctx.params.slug)
    return this.submit(ctx, resource)
  }

  async storeSeries(ctx: HttpContext) {
    const resource = await MemberEnrollmentService.seriesBySlug(ctx.params.slug)
    return this.submit(ctx, resource)
  }

  async updateSeries(ctx: HttpContext) {
    const resource = await MemberEnrollmentService.seriesBySlug(ctx.params.slug)
    return this.submit(ctx, resource)
  }

  private async submit(
    ctx: HttpContext,
    resource: Awaited<ReturnType<typeof MemberEnrollmentService.courseBySlug>>
  ) {
    const user = ctx.auth.getUserOrFail()
    const requestData = ctx.request.all()

    // Filter out empty contextLinks to avoid URL validation errors on blank inputs
    // Inertia Form may send as 'contextLinks' or 'contextLinks[]' depending on encoding
    for (const key of ['contextLinks', 'contextLinks[]']) {
      if (Array.isArray(requestData[key])) {
        requestData[key] = requestData[key].filter((link: string) => link && link.trim() !== '')
        if (requestData[key].length === 0) delete requestData[key]
      } else if (typeof requestData[key] === 'string') {
        if (requestData[key].trim() === '') delete requestData[key]
      }
    }

    const payload = await submitMemberEnrollmentValidator.validate(requestData)
    const videoFile = ctx.request.file('videoFile', {
      size: '100mb',
      extnames: ['mp4', 'webm', 'mov'],
    })

    if (payload.videoSource === MemberEnrollmentVideoSources.FILE) {
      if (!videoFile || videoFile.hasErrors) {
        ctx.session.flash('error', 'Please upload a mp4, webm, or mov video under 100MB.')
        return ctx.response.redirect().back()
      }

      const uploadedVideo = await attachmentManager.createFromFile(videoFile)
      await MemberEnrollmentService.submitOrUpdate(user, resource, {
        ...payload,
        videoFile: uploadedVideo,
        videoUrl: null,
      })
    } else {
      await MemberEnrollmentService.submitOrUpdate(user, resource, {
        ...payload,
        videoFile: null,
      })
    }

    ctx.session.flash('success', 'Your enrollment request has been submitted.')
    return ctx.response.redirect().back()
  }
}
