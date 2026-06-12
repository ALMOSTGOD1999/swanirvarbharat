import type { HttpContext } from '@adonisjs/core/http'
import { defaultLessonPanelValidator } from '#validators/lesson'

export default class LessonPreferencesController {
  async toggleAutoplay({ response, auth, session }: HttpContext) {
    if (auth.user) {
      auth.user.isEnabledAutoplayNext = !auth.user.isEnabledAutoplayNext
      await auth.user.save()
    } else {
      const nextValue = !(session.get('autoplayNext', 'true') === 'true')
      session.put('autoplayNext', nextValue.toString())
    }

    return response.redirect().back()
  }

  async setDefaultPanel({ request, response, auth, session }: HttpContext) {
    const { panel } = await request.validateUsing(defaultLessonPanelValidator)

    if (auth.user) {
      auth.user.defaultLessonPanel = panel
      await auth.user.save()
    } else {
      session.put('defaultLessonPanel', panel)
    }

    return response.redirect().back()
  }
}
