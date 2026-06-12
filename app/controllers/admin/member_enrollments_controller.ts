import type { HttpContext } from '@adonisjs/core/http'

import MemberEnrollmentService from '#services/member_enrollment_service'
import MemberEnrollmentTransformer from '#transformers/member_enrollment_transformer'
import {
  memberEnrollmentIndexValidator,
  rejectMemberEnrollmentValidator,
  revokeMemberEnrollmentValidator,
} from '#validators/member_enrollment'

export default class MemberEnrollmentsController {
  async index({ inertia, request, serialize }: HttpContext) {
    const { status, resourceType } = await memberEnrollmentIndexValidator.validate(request.qs())
    const enrollments = await MemberEnrollmentService.listForReview(status, resourceType)
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

    return inertia.render('admin/member_enrollments/index', {
      items,
      status: status ?? '',
      resourceType: resourceType ?? '',
    })
  }

  async show({ inertia, params, serialize }: HttpContext) {
    const enrollment = await MemberEnrollmentService.enrollmentById(params.id)
    const resource = await MemberEnrollmentService.resourceForEnrollment(enrollment)
    const serializedEnrollment = await serialize(MemberEnrollmentTransformer.transform(enrollment))

    return inertia.render('admin/member_enrollments/show', {
      enrollment: serializedEnrollment.data,
      resource: MemberEnrollmentService.resourceSummary(resource),
    })
  }

  async approve({ auth, params, response, session }: HttpContext) {
    const reviewer = auth.getUserOrFail()
    const enrollment = await MemberEnrollmentService.enrollmentById(params.id)
    await MemberEnrollmentService.approve(reviewer, enrollment)
    session.flash('success', 'Enrollment approved.')
    return response.redirect().back()
  }

  async reject({ auth, params, request, response, session }: HttpContext) {
    const reviewer = auth.getUserOrFail()
    const enrollment = await MemberEnrollmentService.enrollmentById(params.id)
    const { rejectionReason } = await rejectMemberEnrollmentValidator.validate(request.all())
    await MemberEnrollmentService.reject(reviewer, enrollment, rejectionReason)
    session.flash('success', 'Enrollment rejected.')
    return response.redirect().back()
  }

  async revoke({ auth, params, request, response, session }: HttpContext) {
    const reviewer = auth.getUserOrFail()
    const enrollment = await MemberEnrollmentService.enrollmentById(params.id)
    const { revocationReason } = await revokeMemberEnrollmentValidator.validate(request.all())
    await MemberEnrollmentService.revoke(reviewer, enrollment, revocationReason)
    session.flash('success', 'Enrollment revoked.')
    return response.redirect().back()
  }

  async course({ response }: HttpContext) {
    return response.redirect().toRoute('admin.memberEnrollments.index')
  }

  async series({ response }: HttpContext) {
    return response.redirect().toRoute('admin.memberEnrollments.index')
  }
}
