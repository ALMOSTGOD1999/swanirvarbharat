import encryption from '@adonisjs/core/services/encryption'
import hash from '@adonisjs/core/services/hash'

import type { HttpContext } from '@adonisjs/core/http'
import { resetPasswordValidator } from '#validators/user'
import NotAllowedException from '#exceptions/not_allowed_exception'
import User from '#models/user'
import AuthAttempt from '#models/auth_attempt'
import logger from '@adonisjs/core/services/logger'

export default class ResetPasswordsController {
  async index({ request, params, inertia }: HttpContext) {
    const isSignatureValid = request.hasValidSignature('Reset password')
    const email = encryption.decrypt(params.email) as string
    const token = await hash.make(email)

    return inertia.render('auth/reset_password', { isSignatureValid, email, token })
  }

  async handle({ request, response, session }: HttpContext) {
    const { email, password, token } = await request.validateUsing(resetPasswordValidator)

    try {
      if (!(await hash.verify(token, email))) {
        throw new NotAllowedException('The request structure is invalid.')
      }

      const user = await User.findByOrFail('email', email)

      user.password = password

      await user.save()

      // await emitter.emit('email:password_reset_success', { user })
      await AuthAttempt.clear(email)

      session.flash('success', 'Your password has been successfully reset, please sign in')

      return response.redirect().toRoute('session.create')
    } catch (error) {
      logger.error('PasswordResetController.resetPasswordStore', { email, error })

      session.flash(
        'error',
        'Something went wrong and we may not have been able to reset your password.'
      )

      return response.redirect().back()
    }
  }
}
