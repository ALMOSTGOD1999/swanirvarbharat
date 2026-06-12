import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import CandidateApplication from '#models/candidate_application'

export default class AdminCandidatesController {
  /**
   * List all applications
   */
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const status = request.input('status', '')

    let query = CandidateApplication.query()
      .preload('user', (q) => q.preload('profile'))
      .orderBy('createdAt', 'desc')

    if (status) {
      query = query.where('status', status)
    }

    const applications = await query.paginate(page, 20)

    return inertia.render('admin/candidates/index', {
      applications: applications.serialize().data,
      pagination: applications.getMeta(),
      currentStatus: status,
    })
  }

  /**
   * Show a single application
   */
  async show({ inertia, params }: HttpContext) {
    const application = await CandidateApplication.query()
      .where('id', params.id)
      .preload('user', (q) => q.preload('profile'))
      .firstOrFail()

    return inertia.render('admin/candidates/show', {
      application: application.serialize(),
    })
  }

  /**
   * Approve application
   */
  async approve({ params, response, auth, session }: HttpContext) {
    const admin = auth.getUserOrFail()
    const application = await CandidateApplication.findOrFail(params.id)

    application.status = 'approved'
    application.reviewedBy = admin.id
    application.reviewedAt = DateTime.now()
    application.adminRemarks = null // Clear any previous remarks
    await application.save()

    session.flash('success', 'Application approved.')
    response.redirect().toRoute('admin.candidates.index')
  }

  /**
   * Reject application with a reason
   */
  async reject({ params, request, response, auth, session }: HttpContext) {
    const admin = auth.getUserOrFail()
    const application = await CandidateApplication.findOrFail(params.id)
    const reason = request.input('reason', '')

    application.status = 'rejected'
    application.reviewedBy = admin.id
    application.reviewedAt = DateTime.now()
    application.adminRemarks = reason || null
    await application.save()

    session.flash('success', 'Application rejected.')
    response.redirect().toRoute('admin.candidates.index')
  }

  /**
   * Add admin remark and keep under review
   */
  async remark({ params, request, response, auth, session }: HttpContext) {
    const admin = auth.getUserOrFail()
    const application = await CandidateApplication.findOrFail(params.id)
    const remark = request.input('remark', '')

    application.status = 'under_review'
    application.reviewedBy = admin.id
    application.adminRemarks = remark || application.adminRemarks
    await application.save()

    session.flash('success', 'Remark added. Application is under review.')
    response.redirect().toRoute('admin.candidates.show', { id: application.id })
  }
}
