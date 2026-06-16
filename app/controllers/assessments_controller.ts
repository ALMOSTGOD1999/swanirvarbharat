import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Assessment from '#models/assessment'
import AssessmentQuestion from '#models/assessment_question'
import AssessmentResult from '#models/assessment_result'
import Post from '#models/post'

export default class AssessmentsController {
  async show({ params, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const post = await Post.findByOrFail('slug', params.slug)
    const assessment = await Assessment.findBy('postId', post.id)
    if (!assessment) return response.json({ assessment: null })

    const questions = await AssessmentQuestion.query()
      .where('assessmentId', assessment.id)
      .orderBy('sortOrder', 'asc')

    const existingResult = await AssessmentResult.findBy({ userId: user.id, assessmentId: assessment.id })

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
      result: existingResult ? { score: existingResult.score, total: existingResult.total } : null,
    })
  }

  async submit({ params, request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const post = await Post.findByOrFail('slug', params.slug)
    const assessment = await Assessment.findByOrFail('postId', post.id)

    const existing = await AssessmentResult.findBy({ userId: user.id, assessmentId: assessment.id })
    if (existing) {
      return response.json({ result: { score: existing.score, total: existing.total }, alreadyCompleted: true })
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
      return { questionId: q.id, userAnswer, correctAnswer: q.correctAnswer, isCorrect }
    })

    await AssessmentResult.create({
      userId: user.id,
      assessmentId: assessment.id,
      score,
      total: questions.length,
      answers: details,
      completedAt: DateTime.now(),
    })

    return response.json({ result: { score, total: questions.length }, details })
  }
}
