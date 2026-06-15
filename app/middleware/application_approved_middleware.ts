import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import CandidateApplication from '#models/candidate_application'
import { Roles } from '#enums/roles'

export default class ApplicationApprovedMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = await ctx.auth.authenticate()

    // Admins and contributors skip the check
    if (user.roleId !== Roles.USER) {
      return next()
    }

    const application = await CandidateApplication.findBy('userId', user.id)

    // No application or still onboarding → redirect to onboarding
    if (!application || application.status === 'email_verified' || application.status === 'onboarding_started') {
      sessionFlash(ctx, 'Please complete your profile and submit it for review first.')
      return ctx.response.redirect().toRoute('onboarding.index')
    }

    // Submitted or under review → show status page
    if (application.status !== 'approved') {
      sessionFlash(ctx, 'Your application is under review. You will get access once approved.')
      return ctx.response.redirect().toRoute('application.status')
    }

    return next()
  }
}

function sessionFlash(ctx: HttpContext, message: string) {
  if (ctx.session) {
    ctx.session.flash('error', message)
  }
}
