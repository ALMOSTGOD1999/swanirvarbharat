import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'

export default class ProfilesController {
  async show({ params, inertia, response }: HttpContext) {
    const handle = params.handle?.replace('@', '')

    const user = await User.query().where('username', handle).preload('profile').first()

    if (!user) {
      return response.redirect().toRoute('home')
    }

    return inertia.render('profile', {
      profileUser: UserTransformer.transform(user),
    })
  }
}
