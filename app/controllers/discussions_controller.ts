import type { HttpContext } from '@adonisjs/core/http'
import Discussion from '#models/discussion'
import Taxonomy from '#models/taxonomy'
import DiscussionView from '#models/discussion_view'
import { DiscussionViewTypes } from '#enums/discussion_view_types'
import DiscussionTransformer from '#transformers/discussion_transformer'
import {
  discussionSearchValidator,
  createDiscussionValidator,
  updateDiscussionValidator,
} from '#validators/discussion'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import { CommentStateIds } from '#enums/comment_state_ids'

export default class DiscussionsController {
  async index({ inertia, request }: HttpContext) {
    const {
      page = 1,
      limit = 20,
      q,
      feed,
      topics,
    } = await request.validateUsing(discussionSearchValidator)

    const query = Discussion.query()
      .preload('user')
      .preload('taxonomy')
      .withCount('votes')
      .withCount('comments', (q) => q.where('stateId', CommentStateIds.PUBLIC))

    if (q) {
      query.where('title', 'like', `%${q}%`)
    }

    if (feed === 'popular') {
      query.orderBy('votes_count', 'desc')
    } else if (feed === 'noreplies') {
      query.where('comments_count', 0)
    } else if (feed === 'unsolved') {
      query.whereNull('solvedAt')
    } else if (feed === 'solved') {
      query.whereNotNull('solvedAt')
    }

    if (topics?.length) {
      query.whereIn('taxonomyId', topics)
    }

    if (!feed || feed === 'none') {
      query.orderBy('updatedAt', 'desc')
    }

    const discussions = await query.paginate(page, limit)
    discussions.queryString(request.qs())

    return inertia.render('discussions/index', {
      discussions: DiscussionTransformer.paginate(discussions.all(), discussions.getMeta()),
      filters: { q, feed, topics },
    } as any)
  }

  async show({ inertia, params, auth, request }: HttpContext) {
    const discussion = await Discussion.query()
      .where('slug', params.slug)
      .preload('user')
      .preload('taxonomy')
      .preload('comments', (query) => {
        query.preload('user', (u) => u.preload('profile'))
        query.preload('userVotes', (v) => v.select('id'))
        query.where('stateId', '!=', CommentStateIds.ARCHIVED)
        query.orderBy('createdAt', 'asc')
      })
      .firstOrFail()

    // Increment views
    discussion.views = (discussion.views || 0) + 1
    await discussion.save()

    // Store view record
    if (auth.user) {
      await DiscussionView.updateOrCreate(
        {
          discussionId: discussion.id,
          userId: auth.user.id,
          typeId: DiscussionViewTypes.VIEW,
        },
        {
          ipAddress: request.ip(),
          userAgent: request.header('user-agent') || '',
        }
      )
    }

    return inertia.render('discussions/show', {
      discussion: DiscussionTransformer.transform(discussion),
      currentUserId: auth.user?.id || null,
    } as any)
  }

  async create({ inertia }: HttpContext) {
    const taxonomies = await Taxonomy.query().orderBy('name', 'asc')
    return inertia.render('discussions/form', {
      taxonomies,
    } as any)
  }

  async store({ request, response, auth, session, bouncer }: HttpContext) {
    await bouncer.with('DiscussionPolicy').authorize('create')

    const user = auth.getUserOrFail()
    const data = await request.validateUsing(createDiscussionValidator)

    const discussion = await Discussion.create({
      userId: user.id,
      title: data.title,
      body: data.body,
      taxonomyId: data.taxonomyId || null,
    })

    session.flash('success', 'Discussion created successfully')
    return response.redirect().toRoute('discussions.show', { slug: discussion.slug })
  }

  async edit({ inertia, params, bouncer }: HttpContext) {
    const discussion = await Discussion.findOrFail(params.id)
    await bouncer.with('DiscussionPolicy').authorize('update', discussion)

    const taxonomies = await Taxonomy.query().orderBy('name', 'asc')
    return inertia.render('discussions/form', {
      discussion: DiscussionTransformer.transform(discussion),
      taxonomies,
    } as any)
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    const discussion = await Discussion.findOrFail(params.id)
    await bouncer.with('DiscussionPolicy').authorize('update', discussion)

    const data = await request.validateUsing(updateDiscussionValidator, {
      meta: { id: discussion.id },
    })

    discussion.merge(data)
    await discussion.save()

    session.flash('success', 'Discussion updated successfully')
    return response.redirect().toRoute('discussions.show', { slug: discussion.slug })
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
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
    return response.redirect().toRoute('discussions.index')
  }

  async toggleVote({ params, response, auth }: HttpContext) {
    const discussion = await Discussion.findOrFail(params.id)
    const user = auth.getUserOrFail()

    const hasVoted = await Discussion.query()
      .where('id', params.id)
      .whereHas('votes', (q) => q.where('users.id', user.id))
      .first()

    if (hasVoted) {
      await discussion.related('votes').detach([user.id])
    } else {
      await discussion.related('votes').attach([user.id])
    }

    return response.redirect().back()
  }

  async toggleSolved({ params, response, auth, session }: HttpContext) {
    const discussion = await Discussion.query()
      .where('slug', params.slug)
      .preload('user')
      .firstOrFail()

    if (discussion.userId !== auth.user?.id) {
      session.flash('error', 'Only the discussion owner can mark as solved')
      return response.redirect().back()
    }

    if (discussion.solvedAt) {
      discussion.solvedAt = null
      discussion.solvedCommentId = null
      session.flash('success', 'Discussion marked as unsolved')
    } else {
      discussion.solvedAt = DateTime.now()
      session.flash('success', 'Discussion marked as solved')
    }

    await discussion.save()
    return response.redirect().back()
  }
}
