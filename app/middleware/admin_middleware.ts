import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import { Roles } from '#enums/roles'
import { errors } from '@adonisjs/auth'
import env from '#start/env'

export default class AdminMiddleware {
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    try {
      const user = await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
      if (user.roleId !== Roles.USER) return next()

      throw new errors.E_UNAUTHORIZED_ACCESS('Unauthorized Access', {
        redirectTo: this.redirectTo,
        guardDriverName: 'web',
      })
    } catch (err) {
      if (err instanceof errors.E_UNAUTHORIZED_ACCESS) {
        return ctx.inertia.location(env.get('VITE_APP_URL') + this.redirectTo)
      }
      throw err
    }
  }
}
