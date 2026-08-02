import type { HttpContext } from '@adonisjs/core/http'
import edge from 'edge.js'
import mail from '@adonisjs/mail/services/main'
import encryption from '@adonisjs/core/services/encryption'
import router from '@adonisjs/core/services/router'

import OnSignInSucceeded from '#actions/auth/on_signin_succeeded'
import { Roles } from '#enums/roles'
import User from '#models/user'
import Profile from '#models/profile'
import { signupValidator } from '#validators/user'
import env from '#start/env'
import { appUrl } from '#config/app'

export default class NewAccountController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signup', {})
  }

  async store(ctx: HttpContext) {
    const { request, response, session } = ctx
    const payload = await request.validateUsing(signupValidator)

    // Block re-signup only for accounts that have actually signed in before.
    // Emails that were registered but never signed in (verified or not) can re-register.
    const existingEmailUser = await User.findBy('email', payload.email)
    if (existingEmailUser && existingEmailUser.lastLoginAt) {
      session.flash('error', 'This email is already registered. Please sign in instead.')
      return response.redirect().toRoute('session.create')
    }

    // Check if username is already taken by a different user
    const existingUsernameUser = await User.findBy('username', payload.username)
    if (existingUsernameUser && existingUsernameUser.id !== existingEmailUser?.id) {
      session.flash('error', 'This username is already taken. Please choose another.')
      return response.redirect().back()
    }

    let user: User

    if (existingEmailUser) {
      // Re-register an account that never signed in: reset credentials and email
      // verification, then start fresh with a new profile. The verification email
      // is sent below as usual.
      user = existingEmailUser
      user.username = payload.username
      user.password = payload.password
      user.emailVerifiedAt = null
      await user.save()

      // Delete old profile and create a new one
      const oldProfile = await Profile.find(user.id)
      if (oldProfile) {
        await oldProfile.delete()
      }
      await user.related('profile').create({})
    } else {
      // Create a new user
      user = await User.create({ ...payload, roleId: Roles.USER })
      await user.related('profile').create({})
    }

    await OnSignInSucceeded.run(ctx, user, true)

    // Generate verification URL
    const signedUrl = router.urlBuilder.signedUrlFor(
      'auth.verify.handle',
      { email: encryption.encrypt(payload.email) },
      { expiresIn: '24h', prefixUrl: appUrl, purpose: 'Verify email' }
    )

    // Send verification email (ignoring transport errors in development)
    try {
      const html = await edge.render('emails/verify_email', { user, href: signedUrl })
      await mail.send((message) => {
        message.to(user.email).subject('[Swanirvarbharat] Verify your email address').html(html)
      })
    } catch (_error) {
      // Email transport may not be configured in development
    }

    console.log(`\n=== Verify Email (dev) ===\n${signedUrl}\n========================\n`)

    session.flash(
      'success',
      `Welcome to ${env.get('VITE_APP_NAME')}! Please check your email to verify your account.`
    )

    response.redirect().toRoute('auth.verify.notice')
  }
}
