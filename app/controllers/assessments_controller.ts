import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Assessment from '#models/assessment'
import AssessmentQuestion from '#models/assessment_question'
import AssessmentResult from '#models/assessment_result'
import Post from '#models/post'
import db from '@adonisjs/lucid/services/db'

export default class AssessmentsController {
  async show({ params, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const post = await Post.findByOrFail('slug', params.slug)
    const assessment = await Assessment.findBy('postId', post.id)
    if (!assessment) return response.json({ assessment: null })

    const questions = await AssessmentQuestion.query()
      .where('assessmentId', assessment.id)
      .orderBy('sortOrder', 'asc')

    const existingResult = await AssessmentResult.findBy({
      userId: user.id,
      assessmentId: assessment.id,
    })

    // Find next lesson in the same series
    const nextLesson = await this.getNextLesson(post.id)

    return response.json({
      assessment: { id: assessment.id },
      questions: questions.map((q) => ({
        id: q.id,
        question: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        sortOrder: q.sortOrder,
      })),
      result: existingResult
        ? {
            score: existingResult.score,
            total: existingResult.total,
            details: existingResult.answers,
          }
        : null,
      nextLesson,
    })
  }

  async submit({ params, request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const post = await Post.findByOrFail('slug', params.slug)
    const assessment = await Assessment.findByOrFail('postId', post.id)

    const existing = await AssessmentResult.findBy({ userId: user.id, assessmentId: assessment.id })
    if (existing) {
      const nextLesson = await this.getNextLesson(post.id)
      return response.json({
        result: { score: existing.score, total: existing.total, details: existing.answers },
        alreadyCompleted: true,
        nextLesson,
      })
    }

    const questions = await AssessmentQuestion.query()
      .where('assessmentId', assessment.id)
      .orderBy('sortOrder', 'asc')

    const answers = request.input('answers', {})
    let score = 0
    const details = questions.map((q) => {
      const userAnswer = answers[q.id] || ''
      const isCorrect = userAnswer.toUpperCase() === q.correctAnswer.toUpperCase()
      if (isCorrect) score++
      return {
        questionId: q.id,
        question: q.question,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
      }
    })

    await AssessmentResult.create({
      userId: user.id,
      assessmentId: assessment.id,
      score,
      total: questions.length,
      answers: details,
      completedAt: DateTime.now(),
    })

    const nextLesson = await this.getNextLesson(post.id)

    return response.json({ result: { score, total: questions.length, details }, nextLesson })
  }

  async history({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const results = await AssessmentResult.query()
      .where('userId', user.id)
      .preload('assessment', (q) => q.preload('post'))
      .orderBy('completedAt', 'desc')

    return response.json({
      results: results.map((r) => ({
        id: r.id,
        lessonTitle: r.assessment?.post?.title || 'Unknown',
        lessonSlug: r.assessment?.post?.slug || '',
        score: r.score,
        total: r.total,
        completedAt: r.completedAt,
      })),
    })
  }

  private async getNextLesson(currentPostId: string) {
    const row = await db.from('series_posts').where('post_id', currentPostId).first()

    if (!row) return null

    const next = await db
      .from('series_posts')
      .where('series_id', row.series_id)
      .where('sort_order', '>', row.sort_order)
      .orderBy('sort_order', 'asc')
      .first()

    if (!next) return null

    const nextPost = await Post.find(next.post_id)
    if (!nextPost) return null

    return { slug: nextPost.slug, title: nextPost.title }
  }
}
