import type { HttpContext } from '@adonisjs/core/http'
import encryption from '@adonisjs/core/services/encryption'
import router from '@adonisjs/core/services/router'
import { DateTime } from 'luxon'

import User from '#models/user'
import { appUrl } from '#config/app'

export default class EmailVerificationController {
  async notice({ inertia }: HttpContext) {
    return inertia.render('auth/verify_email', {})
  }

  async verify({ request, response, session }: HttpContext) {
    if (!request.hasValidSignature('Verify email')) {
      session.flash('error', 'Your verification link is invalid or has expired.')
      return response.redirect().toRoute('home')
    }

    const email = encryption.decrypt(request.param('email')) as string
    const user = await User.findByOrFail('email', email)

    if (user.emailVerifiedAt) {
      session.flash('success', 'Your email is already verified. You can sign in.')
      return response.redirect().toRoute('session.create')
    }

    user.emailVerifiedAt = DateTime.now()
    await user.save()

    session.flash('success', 'Your email has been verified. You can now sign in.')
    return response.redirect().toRoute('session.create')
  }

  async resend({ request, response, session }: HttpContext) {
    const email = request.input('email')
    if (!email) {
      session.flash('error', 'Please provide your email address.')
      return response.redirect().back()
    }

    const user = await User.findBy('email', email)
    if (!user) {
      session.flash('success', 'If the email is registered, a new verification link has been sent.')
      return response.redirect().toRoute('auth.verify.notice')
    }

    if (user.emailVerifiedAt) {
      session.flash('success', 'Your email is already verified. You can sign in.')
      return response.redirect().toRoute('session.create')
    }

    const signedUrl = router.urlBuilder.signedUrlFor(
      'auth.verify.handle',
      { email: encryption.encrypt(email) },
      { expiresIn: '24h', prefixUrl: appUrl, purpose: 'Verify email' }
    )

    console.log(
      `\n=== Resend Verify Email (dev) ===\n${signedUrl}\n===============================\n`
    )

    session.flash('success', 'A new verification email has been sent.')
    return response.redirect().toRoute('auth.verify.notice')
  }
}
