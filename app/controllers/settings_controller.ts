import type { HttpContext } from '@adonisjs/core/http'
import { attachmentManager } from '@jrmc/adonis-attachment'
import hash from '@adonisjs/core/services/hash'
import vine from '@vinejs/vine'
import UserTransformer from '#transformers/user_transformer'
import { profileUpdateValidator, emailNotificationValidator } from '#validators/profile'
import {
  updateUsernameValidator,
  updateEmailValidator,
  updatePasswordValidator,
} from '#validators/user'

export default class SettingsController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    await user.load('profile')

    return inertia.render('settings', { user: UserTransformer.transform(user) })
  }

  async updateProfile({ request, response, auth, session }: HttpContext) {
    const user = auth.getUserOrFail()
    await user.load('profile')

    const payload = await request.validateUsing(profileUpdateValidator)
    await user.profile.merge(payload).save()

    session.flash('success', 'Profile updated successfully')
    return response.redirect().toRoute('settings.show', { section: 'profile' })
  }

  async updateUsername({ request, response, auth, session }: HttpContext) {
    const user = auth.getUserOrFail()

    const payload = await request.validateUsing(updateUsernameValidator, {
      meta: { id: user.id },
    })
    await user.merge(payload).save()

    session.flash('success', 'Username updated successfully')
    return response.redirect().toRoute('settings.show', { section: 'account' })
  }

  async updateEmail({ request, response, auth, session }: HttpContext) {
    const user = auth.getUserOrFail()

    const { email, password } = await request.validateUsing(updateEmailValidator, {
      meta: { id: user.id },
    })

    const isPasswordValid = await hash.verify(user.password, password)
    if (!isPasswordValid) {
      session.flash('error', 'Incorrect password')
      return response.redirect().toRoute('settings.show', { section: 'account' })
    }

    await user.merge({ email }).save()

    session.flash('success', 'Email updated successfully')
    return response.redirect().toRoute('settings.show', { section: 'account' })
  }

  async updatePassword({ request, response, auth, session }: HttpContext) {
    const user = auth.getUserOrFail()

    const { currentPassword, password } = await request.validateUsing(updatePasswordValidator)

    const isPasswordValid = await hash.verify(user.password, currentPassword)
    if (!isPasswordValid) {
      session.flash('error', 'Incorrect current password')
      return response.redirect().toRoute('settings.show', { section: 'account' })
    }

    await user.merge({ password }).save()

    session.flash('success', 'Password updated successfully')
    return response.redirect().toRoute('settings.show', { section: 'account' })
  }

  async updateNotifications({ request, response, auth, session }: HttpContext) {
    const user = auth.getUserOrFail()
    await user.load('profile')

    const payload = await request.validateUsing(emailNotificationValidator)
    await user.profile.merge(payload).save()

    session.flash('success', 'Notification preferences updated')
    return response.redirect().toRoute('settings.show', { section: 'notifications' })
  }

  async updateAvatar({ request, response, auth, session }: HttpContext) {
    const user = auth.getUserOrFail()

    const avatar = request.file('avatar', {
      size: '2mb',
      extnames: ['png', 'jpeg', 'jpg', 'gif'],
    })

    if (!avatar || !avatar.isValid) {
      session.flash('error', 'Invalid avatar file. Please use PNG, JPEG, or GIF under 2MB.')
      return response.redirect().toRoute('settings.show', { section: 'profile' })
    }

    const uploadedFile = await attachmentManager.createFromFile(avatar)
    await user.merge({ avatar: uploadedFile }).save()

    session.flash('success', 'Avatar updated successfully')
    return response.redirect().toRoute('settings.show', { section: 'profile' })
  }

  async destroy({ request, response, auth, session }: HttpContext) {
    const user = auth.getUserOrFail()

    const { password } = await request.validateUsing(
      vine.compile(
        vine.object({
          password: vine.string(),
        })
      )
    )

    const isPasswordValid = await hash.verify(user.password, password)
    if (!isPasswordValid) {
      session.flash('error', 'Incorrect password')
      return response.redirect().toRoute('settings.show', { section: 'account' })
    }

    await user.delete()
    await auth.use('web').logout()

    session.flash('success', 'Your account has been deleted')
    return response.redirect().toRoute('home')
  }
}
