import { errors } from '@adonisjs/auth'

import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

import User from '#models/user'
import CandidateApplication from '#models/candidate_application'
import { loginValidator } from '#validators/user'
import AuthAttempt from '#models/auth_attempt'
import OnSignInSucceeded from '#actions/auth/on_signin_succeeded'
import OnSignOutSucceeded from '#actions/auth/on_singout_succeeded'
import { Roles } from '#enums/roles'

export default class SessionController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async store(ctx: HttpContext) {
    const { request, auth, response, session } = ctx
    const { uid, password } = await request.validateUsing(loginValidator)
    if (await AuthAttempt.disallows(uid)) {
      session.flash(
        'error',
        'Your account has been locked due to repeated bad login attempts. Please reset your password.'
      )
      return response.redirect().toRoute('forget_passwords.index')
    }

    const user = await this.verifyCredentials(uid, password)

    // Check if email is verified (skip for admin)
    if (!user.emailVerifiedAt && user.roleId !== Roles.ADMIN) {
      session.flash('error', 'Please verify your email address before signing in.')
      return response.redirect().toRoute('auth.verify.notice')
    }

    await auth.use('web').login(user)
    await AuthAttempt.clear(uid)

    // Record the last successful sign-in so the signup flow can tell
    // accounts that have been used from those that have not.
    user.lastLoginAt = DateTime.now()
    await user.save()

    await OnSignInSucceeded.run(ctx, user)

    // Redirect admin users to the admin panel
    if (
      user.roleId === Roles.ADMIN ||
      user.roleId === Roles.CONTRIBUTOR_LVL_1 ||
      user.roleId === Roles.CONTRIBUTOR_LVL_2
    ) {
      session.flash('success', `Welcome to the admin panel, ${user.handle}!`)
      return response.redirect().toRoute('admin.dashboard.index')
    }

    // Check if user has completed onboarding
    const application = await CandidateApplication.findBy('userId', user.id)
    const needsOnboarding =
      !application ||
      application.status === 'email_verified' ||
      application.status === 'onboarding_started'

    if (needsOnboarding) {
      session.flash('success', `Welcome, ${user.handle}! Please complete your profile.`)
      return response.redirect().toRoute('onboarding.index')
    }

    session.flash('success', `Welcome back, ${user.handle}!`)

    response.redirect().toRoute('dashboard')
  }

  async destroy(ctx: HttpContext) {
    const { auth, response, session } = ctx
    const user = auth.getUserOrFail()

    await auth.use('web').logout()
    await OnSignOutSucceeded.run(ctx, user)

    session.flash('success', 'You have been signed out. See you next time!')

    response.redirect().toRoute('session.create')
  }

  private async verifyCredentials(uid: string, password: string) {
    try {
      return await User.verifyCredentials(uid, password)
    } catch (error) {
      if (error instanceof errors.E_INVALID_CREDENTIALS) {
        await AuthAttempt.recordBadLogin(uid)
      }
      throw error
    }
  }
}
