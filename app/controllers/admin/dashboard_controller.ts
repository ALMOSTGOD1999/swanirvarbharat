import type { HttpContext } from '@adonisjs/core/http'
import StatsService from '#services/stats_service'

export default class DashboardController {
  async index({ inertia }: HttpContext) {
    const counts = await StatsService.getDashboardCounts()

    return inertia.render('admin/dashboard', {
      counts,
    })
  }
}
