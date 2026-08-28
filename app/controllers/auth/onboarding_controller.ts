import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { existsSync, mkdirSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'
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

      // Step 2 (Documents): require all required (starred) documents before advancing
      const requiredDocs = [
        application.certificate10th,
        application.certificate12th,
        application.passportPhoto,
      ].filter(Boolean).length
      if (requiredDocs === 3) currentStep = 3

      if (application.introductionVideo) currentStep = 4
      if (application.kycDocument) currentStep = 5
      if (application.purposeVideo || application.purposeDescription) currentStep = 6
      if (application.status === 'submitted' || application.status === 'under_review')
        currentStep = 7
    }

    const appData = application
      ? {
          id: application.id,
          userId: application.userId,
          status: application.status,
          fullName: application.fullName,
          gender: application.gender,
          age: application.age,
          educationalQualification: application.educationalQualification,
          certificate10th: application.certificate10th,
          certificate12th: application.certificate12th,
          certificateGraduation: application.certificateGraduation,
          certificatePostGraduation: application.certificatePostGraduation,
          passportPhoto: application.passportPhoto,
          introductionVideo: application.introductionVideo,
          purposeVideo: application.purposeVideo,
          kycType: application.kycType,
          kycDocument: application.kycDocument,
          phone: application.phone,
          purposeDescription: application.purposeDescription,
          adminRemarks: application.adminRemarks,
          reviewedBy: application.reviewedBy,
          reviewedAt: application.reviewedAt,
          createdAt: application.createdAt,
          updatedAt: application.updatedAt,
        }
      : null

    return inertia.render('onboarding/index', {
      application: appData,
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
    const phone = request.input('phone') as string
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
    application.phone = phone || null
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

    // Validate required fields before submission
    const docsCount = [
      application.certificate10th,
      application.certificate12th,
      application.passportPhoto,
    ].filter(Boolean).length

    if (!application.fullName || !application.gender || !application.educationalQualification) {
      session.flash(
        'error',
        'Please complete all required fields in Step 1 (Personal Information).'
      )
      return response.redirect().toRoute('onboarding.index')
    }

    if (docsCount < 3) {
      session.flash(
        'error',
        'Please upload at least 3 required documents (10th, 12th, Passport Photo).'
      )
      return response.redirect().toRoute('onboarding.index')
    }

    if (!application.introductionVideo) {
      session.flash('error', 'Please upload your introduction video.')
      return response.redirect().toRoute('onboarding.index')
    }

    if (!application.kycDocument) {
      session.flash('error', 'Please upload your KYC document.')
      return response.redirect().toRoute('onboarding.index')
    }

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

    const appData = application
      ? {
          id: application.id,
          status: application.status,
          fullName: application.fullName,
          gender: application.gender,
          age: application.age,
          educationalQualification: application.educationalQualification,
          certificate10th: application.certificate10th,
          certificate12th: application.certificate12th,
          certificateGraduation: application.certificateGraduation,
          certificatePostGraduation: application.certificatePostGraduation,
          passportPhoto: application.passportPhoto,
          introductionVideo: application.introductionVideo,
          purposeVideo: application.purposeVideo,
          kycType: application.kycType,
          kycDocument: application.kycDocument,
          phone: application.phone,
          purposeDescription: application.purposeDescription,
          adminRemarks: application.adminRemarks,
          createdAt: application.createdAt,
          updatedAt: application.updatedAt,
        }
      : null

    return inertia.render('onboarding/status', {
      application: appData,
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

    // Copy from temp path (autoProcess: true moves files to OS temp)
    const destPath = join(app.publicPath(uploadDir), fileName)
    if (file.tmpPath) {
      copyFileSync(file.tmpPath, destPath)
    } else {
      throw new Error('File upload failed: no temp file available')
    }

    return {
      url: `/${filePath}`,
      extname: file.extname,
      size: file.size,
      name: fileName,
    }
  }
}
