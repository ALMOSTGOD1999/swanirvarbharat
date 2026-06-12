import limiter from '@adonisjs/limiter/services/main'

import type { HttpContext } from '@adonisjs/core/http'

import { getIpAddress } from '#utils/get_ip'
import { forgetPasswordValidator } from '#validators/user'
import User from '#models/user'
import router from '@adonisjs/core/services/router'
import { events } from '#generated/events'
import { appUrl } from '#config/app'
import encryption from '@adonisjs/core/services/encryption'

export default class ForgetPasswordsController {
  async index({ inertia }: HttpContext) {
    return inertia.render('auth/forget_password', {})
  }

  async handle({ request, response, session }: HttpContext) {
    const ipAddress = getIpAddress(request)
    const { email } = await request.validateUsing(forgetPasswordValidator)

    const limitKey = `forgotPasswordSend_${ipAddress}`
    const limit = limiter.use({
      requests: 3,
      duration: '1 min',
      blockDuration: '1 hour',
    })

    try {
      const [throttle, user] = await limit.penalize(limitKey, () => {
        return User.findByOrFail('email', email)
      })

      if (throttle) {
        session.flash('error', 'Too many attempts. Please try again later.')
        return response.redirect().back()
      }

      const signedUrl = router.urlBuilder.signedUrlFor(
        'reset_passwords.index',
        { email: encryption.encrypt(email) },
        { expiresIn: '1h', prefixUrl: appUrl, purpose: 'Reset password' }
      )
      console.log('signedUrl', signedUrl)
      await events.EmailPasswordReset.dispatch(user, signedUrl)
    } catch (_error) {
      console.log({ _error })
    }

    return response.redirect().back()
  }
}
