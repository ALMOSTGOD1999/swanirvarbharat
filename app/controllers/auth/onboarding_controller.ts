import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { existsSync, mkdirSync } from 'node:fs'
import { cuid } from '#utils/id'
import CandidateApplication from '#models/candidate_application'
import type User from '#models/user'

/**
 * Application status flow:
 *   pending_verification → email_verified → onboarding_started →
 *   onboarding_completed → submitted → under_review → approved/rejected
 */
export default class OnboardingController {
  /**
   * Show the onboarding multi-step form (resumes from where user left off)
   */
  async show({ inertia, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const application = await CandidateApplication.findBy('userId', user.id)

    // Determine current step based on what data is filled
    let currentStep = 1
    if (application) {
      if (application.fullName) currentStep = 2
      if (application.certificate10th) currentStep = 3
      if (application.introductionVideo) currentStep = 4
      if (application.kycDocument) currentStep = 5
      if (application.purposeVideo || application.purposeDescription) currentStep = 6
      if (application.status === 'submitted' || application.status === 'under_review')
        currentStep = 7
    }

    return inertia.render('onboarding/index', {
      application: application?.serialize() || null,
      currentStep,
    })
  }

  /**
   * Step 1: Personal Information
   */
  async savePersonalInfo({ request, response, auth, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const { fullName, gender, age, educationalQualification } = request.all()

    let application = await CandidateApplication.findBy('userId', user.id)
    if (!application) {
      application = await CandidateApplication.create({
        userId: user.id,
        status: 'onboarding_started',
      })
    }

    application.fullName = fullName || user.profile?.name || null
    application.gender = gender || null
    application.age = age ? Number(age) : null
    application.educationalQualification = educationalQualification || null
    application.status = 'onboarding_started'
    await application.save()

    session.flash('success', 'Personal information saved.')
    response.redirect().toRoute('onboarding.index')
  }

  /**
   * Step 2: Document Upload
   */
  async uploadDocument({ request, response, auth, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const field = request.param('field') as string
    const file = request.file('file')

    if (!file) {
      session.flash('error', 'Please select a file to upload.')
      return response.redirect().back()
    }

    const allowedFields = [
      'certificate_10th',
      'certificate_12th',
      'certificate_graduation',
      'certificate_post_graduation',
      'passport_photo',
    ]
    if (!allowedFields.includes(field)) {
      session.flash('error', 'Invalid upload field.')
      return response.redirect().back()
    }

    const application = await this.getOrCreateApplication(user)
    const fileRef = await this.handleUpload(file)

    // Map field names to model properties
    const fieldMap: Record<string, string> = {
      certificate_10th: 'certificate10th',
      certificate_12th: 'certificate12th',
      certificate_graduation: 'certificateGraduation',
      certificate_post_graduation: 'certificatePostGraduation',
      passport_photo: 'passportPhoto',
    }

    ;(application as any)[fieldMap[field]] = fileRef
    await application.save()

    session.flash('success', 'Document uploaded successfully.')
    response.redirect().toRoute('onboarding.index')
  }

  /**
   * Step 2: Remove a document
   */
  async removeDocument({ request, response, auth, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const field = request.input('field') as string

    const application = await CandidateApplication.findByOrFail('userId', user.id)
    const fieldMap: Record<string, string> = {
      certificate_10th: 'certificate10th',
      certificate_12th: 'certificate12th',
      certificate_graduation: 'certificateGraduation',
      certificate_post_graduation: 'certificatePostGraduation',
      passport_photo: 'passportPhoto',
    }

    if (fieldMap[field]) {
      // Delete the file from storage
      const ref = (application as any)[fieldMap[field]]
      if (ref?.url) {
        try {
          /* file will remain on disk */
        } catch {}
      }
      ;(application as any)[fieldMap[field]] = null
      await application.save()
    }

    session.flash('success', 'Document removed.')
    response.redirect().toRoute('onboarding.index')
  }

  /**
   * Step 3: Upload introduction video
   */
  async uploadIntroVideo({ request, response, auth, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const file = request.file('video')

    if (!file) {
      session.flash('error', 'Please select a video file.')
      return response.redirect().back()
    }

    const application = await this.getOrCreateApplication(user)
    application.introductionVideo = await this.handleUpload(file)
    await application.save()

    session.flash('success', 'Introduction video uploaded.')
    response.redirect().toRoute('onboarding.index')
  }

  /**
   * Step 4: Upload KYC document
   */
  async uploadKyc({ request, response, auth, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const kycType = request.input('kycType') as string
    const file = request.file('file')

    if (!['aadhaar', 'voter_id'].includes(kycType)) {
      session.flash('error', 'Please select a valid KYC type.')
      return response.redirect().back()
    }

    if (!file) {
      session.flash('error', 'Please select a KYC document file.')
      return response.redirect().back()
    }

    const application = await this.getOrCreateApplication(user)
    application.kycType = kycType
    application.kycDocument = await this.handleUpload(file)
    await application.save()

    session.flash('success', 'KYC document uploaded.')
    response.redirect().toRoute('onboarding.index')
  }

  /**
   * Step 5: Upload purpose video & description
   */
  async savePurpose({ request, response, auth, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const description = request.input('description')
    const file = request.file('video')

    const application = await this.getOrCreateApplication(user)
    application.purposeDescription = description || null

    if (file) {
      application.purposeVideo = await this.handleUpload(file)
    }

    await application.save()
    session.flash('success', 'Purpose information saved.')
    response.redirect().toRoute('onboarding.index')
  }

  /**
   * Submit application
   */
  async submit({ response, auth, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const application = await CandidateApplication.findByOrFail('userId', user.id)

    application.status = 'submitted'
    await application.save()

    session.flash('success', 'Your application has been submitted for review.')
    response.redirect().toRoute('application.status')
  }

  /**
   * Get application status page
   */
  async status({ inertia, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const application = await CandidateApplication.findBy('userId', user.id)

    return inertia.render('onboarding/status', {
      application: application?.serialize() || null,
    })
  }

  // ─── Helpers ────────────────────────────────────────────────

  private async getOrCreateApplication(user: User) {
    let application = await CandidateApplication.findBy('userId', user.id)
    if (!application) {
      application = await CandidateApplication.create({
        userId: user.id,
        status: 'onboarding_started',
      })
    }
    return application
  }

  private async handleUpload(file: any) {
    const fileName = `${cuid()}.${file.extname}`
    const uploadDir = 'uploads'
    const filePath = `${uploadDir}/${fileName}`

    // Ensure the uploads directory exists
    const dir = app.publicPath(uploadDir)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }

    const moved = await file.move(app.publicPath(uploadDir), { name: fileName })

    if (!moved) {
      throw new Error(
        `File move failed: ${file.errors?.map((e: any) => e.message).join(', ') || 'Unknown error'}`
      )
    }

    return {
      url: `/${filePath}`,
      extname: file.extname,
      size: file.size,
      name: fileName,
    }
  }
}
