import type { HttpContext } from '@adonisjs/core/http'
import edge from 'edge.js'
import mail from '@adonisjs/mail/services/main'
import encryption from '@adonisjs/core/services/encryption'
import router from '@adonisjs/core/services/router'
import { DateTime } from 'luxon'

import User from '#models/user'
import { appUrl } from '#config/app'

export default class EmailVerificationController {
  /**
   * Show "check your email" page after signup
   */
  async notice({ inertia }: HttpContext) {
    return inertia.render('auth/verify_email', {})
  }

  /**
   * Verify email using signed URL
   */
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

  /**
   * Resend verification email
   */
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

    // Send verification email (ignoring transport errors in development)
    // Send verification email
    try {
      console.log('MAIL_MAILER =', env.get('MAIL_MAILER'))
      console.log('FROM =', env.get('APP_CONTACT_EMAIL'))
      console.log('TO =', user.email)

      const html = await edge.render('emails/verify_email', {
        user,
        href: signedUrl,
      })

      await mail.send((message) => {
        message.to(user.email).subject('[Swanirvarbharat] Verify your email address').html(html)
      })

      console.log('✅ Email sent successfully')
    } catch (error) {
      console.error('\n=== EMAIL ERROR ===')
      console.error(error)
      console.error('===================\n')
    }

    console.log(
      `\n=== Resend Verify Email (dev) ===\n${signedUrl}\n===============================\n`
    )

    session.flash('success', 'A new verification email has been sent.')
    return response.redirect().toRoute('auth.verify.notice')
  }
}
