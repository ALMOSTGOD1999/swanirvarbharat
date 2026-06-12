import type { HttpContext } from '@adonisjs/core/http'
import Progress from '#models/progress'
import { progressValidator } from '#validators/lesson'

const COMPLETED_PERCENT_THRESHOLD = 95

export default class ProgressController {
  async store({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(progressValidator)
    const progress = await Progress.firstOrCreate(
      { userId: user.id, postId: data.postId },
      { userId: user.id, postId: data.postId }
    )

    if (
      typeof data.watchSeconds === 'number' &&
      (!progress.watchSeconds || data.watchSeconds >= progress.watchSeconds)
    ) {
      progress.watchSeconds = data.watchSeconds
      progress.watchPercent = data.watchPercent ?? progress.watchPercent
    }

    if (
      typeof data.readPercent === 'number' &&
      (!progress.readPercent || data.readPercent >= progress.readPercent)
    ) {
      progress.readPercent = data.readPercent
    }

    if (
      (progress.watchPercent && progress.watchPercent >= COMPLETED_PERCENT_THRESHOLD) ||
      (progress.readPercent && progress.readPercent >= COMPLETED_PERCENT_THRESHOLD)
    ) {
      progress.isCompleted = true
    }

    await progress.save()

    return response.redirect().back()
  }

  async toggle({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(progressValidator)
    const progress = await Progress.firstOrCreate(
      { userId: user.id, postId: data.postId },
      { userId: user.id, postId: data.postId }
    )

    progress.isCompleted = !progress.isCompleted

    if (progress.readPercent && progress.readPercent >= COMPLETED_PERCENT_THRESHOLD) {
      progress.readPercent = COMPLETED_PERCENT_THRESHOLD - 1
    }

    if (progress.watchPercent && progress.watchPercent >= COMPLETED_PERCENT_THRESHOLD) {
      progress.watchPercent = COMPLETED_PERCENT_THRESHOLD - 1
    }

    await progress.save()

    return response.redirect().back()
  }
}
