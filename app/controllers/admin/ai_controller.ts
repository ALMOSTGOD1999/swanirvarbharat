import type { HttpContext } from '@adonisjs/core/http'
import aiService from '#services/ai_service'
import { aiBodyOverviewValidator } from '#validators/ai'
import { YoutubeTranscript } from 'youtube-transcript'

export default class AiController {
  async videoChapters({ params, response, session }: HttpContext) {
    try {
      const { videoId } = params

      // Fetch transcript from YouTube
      const transcript = await YoutubeTranscript.fetchTranscript(videoId)
      const srtText = transcript
        .map((t) => {
          const start = this.formatTime(t.offset / 1000)
          const end = this.formatTime((t.offset + t.duration) / 1000)
          return `${start} --> ${end}\n${t.text}`
        })
        .join('\n\n')

      const chapters = await aiService.generateChapters(srtText)
      return response.ok(chapters)
    } catch (error: any) {
      session.flash('error', `Failed to generate chapters: ${error.message}`)
      return response.redirect().back()
    }
  }

  async bodyOverview({ request, response, session }: HttpContext) {
    try {
      const { body } = await request.validateUsing(aiBodyOverviewValidator)
      const overview = await aiService.generateBodyOverview(body)
      return response.ok(overview)
    } catch (error: any) {
      session.flash('error', `Failed to generate overview: ${error.message}`)
      return response.redirect().back()
    }
  }

  private formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
}
