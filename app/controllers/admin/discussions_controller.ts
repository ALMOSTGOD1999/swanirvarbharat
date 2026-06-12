import type { HttpContext } from '@adonisjs/core/http'
import Discussion from '#models/discussion'
import DiscussionTransformer from '#transformers/discussion_transformer'
import { discussionSearchValidator } from '#validators/discussion'
import db from '@adonisjs/lucid/services/db'

export default class DiscussionsController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.with('DiscussionPolicy').authorize('viewList')

    const {
      page = 1,
      limit = 10,
      q = '',
      taxonomyId,
      solved,
    } = await request.validateUsing(discussionSearchValidator)

    const discussionsQuery = Discussion.query()
      .preload('user')
      .preload('taxonomy')
      .withCount('votes')
      .withCount('comments')

    if (q) {
      discussionsQuery.where((builder) => {
        builder.whereILike('title', `%${q}%`)
        builder.orWhereIn('userId', (sub) => {
          sub.from('users').whereILike('username', `%${q}%`).select('id')
        })
      })
    }

    if (taxonomyId) {
      discussionsQuery.where('taxonomyId', taxonomyId)
    }

    if (solved === 'true') {
      discussionsQuery.whereNotNull('solvedAt')
    } else if (solved === 'false') {
      discussionsQuery.whereNull('solvedAt')
    }

    discussionsQuery.orderBy('createdAt', 'desc')

    const paginatedDiscussions = await discussionsQuery.paginate(page, limit)

    return inertia.render('admin/discussions/index', {
      discussions: DiscussionTransformer.paginate(
        paginatedDiscussions.all(),
        paginatedDiscussions.getMeta()
      ),
      q,
      taxonomyId,
      solved,
    })
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    try {
      const discussion = await Discussion.findOrFail(params.id)
      await bouncer.with('DiscussionPolicy').authorize('delete', discussion)

      await db.transaction(async (trx) => {
        discussion.useTransaction(trx)

        if (discussion.solvedCommentId) {
          discussion.solvedCommentId = null
          await discussion.save()
        }

        const comments = await discussion.related('comments').query().useTransaction(trx)
        const commentIds = comments.map((c) => c.id)

        if (commentIds.length) {
          await db
            .from('comment_votes')
            .whereIn('comment_id', commentIds)
            .useTransaction(trx)
            .delete()
        }

        await discussion.related('discussionViews').query().useTransaction(trx).delete()
        await discussion.related('votes').query().useTransaction(trx).delete()
        await discussion.related('comments').query().useTransaction(trx).delete()
        await discussion.delete()
      })

      session.flash('success', 'Discussion deleted successfully')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', 'Failed to delete discussion.')
      return response.redirect().back()
    }
  }
}
