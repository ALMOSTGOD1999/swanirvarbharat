import type { HttpContext } from '@adonisjs/core/http'
import Comment from '#models/comment'
import { commentStoreValidator, commentUpdateValidator } from '#validators/comment'
import { CommentStateIds } from '#enums/comment_state_ids'

export default class CommentsController {
  async store({ request, response, auth, session, bouncer }: HttpContext) {
    await bouncer.with('CommentPolicy').authorize('create')

    const user = auth.getUserOrFail()
    const data = await request.validateUsing(commentStoreValidator)

    await Comment.create({
      postId: data.postId,
      discussionId: data.discussionId,
      userId: user.id,
      body: data.body,
      replyTo: data.replyTo,
      rootParentId: data.rootParentId,
      identity: user.id,
    })

    session.flash('success', 'Comment posted successfully')
    return response.redirect().back()
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    const comment = await Comment.findOrFail(params.id)
    await bouncer.with('CommentPolicy').authorize('update', comment)

    const data = await request.validateUsing(commentUpdateValidator)
    comment.body = data.body
    await comment.save()

    session.flash('success', 'Comment updated successfully')
    return response.redirect().back()
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    const comment = await Comment.findOrFail(params.id)
    await bouncer.with('CommentPolicy').authorize('delete', comment)

    const childCount = await Comment.query().where('replyTo', comment.id).count('* as total')

    if (Number(childCount[0].$extras.total) > 0) {
      comment.stateId = CommentStateIds.ARCHIVED
      comment.userId = null as any
      comment.body = '[deleted]'
      await comment.save()
    } else {
      await comment.related('userVotes').query().delete()
      await comment.delete()
    }

    session.flash('success', 'Comment deleted successfully')
    return response.redirect().back()
  }

  async toggleVote({ params, response, auth }: HttpContext) {
    const comment = await Comment.findOrFail(params.id)
    const user = auth.getUserOrFail()

    const existing = await user
      .related('commentVotes')
      .query()
      .where('comments.id', comment.id)
      .first()

    if (existing) {
      await user.related('commentVotes').detach([comment.id])
    } else {
      await user.related('commentVotes').attach([comment.id])
    }

    return response.redirect().back()
  }
}
