import type { HttpContext } from '@adonisjs/core/http'
import Comment from '#models/comment'
import CommentTransformer from '#transformers/comment_transformer'
import { commentIndexValidator } from '#validators/comment'
import { CommentStateIds } from '#enums/comment_state_ids'

export default class CommentsController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.with('CommentPolicy').authorize('viewList')

    const {
      page = 1,
      limit = 10,
      q = '',
      postId,
    } = await request.validateUsing(commentIndexValidator)

    const commentsQuery = Comment.query().preload('user').preload('post')

    if (q) {
      commentsQuery.where((builder) => {
        builder.whereILike('body', `%${q}%`)
        builder.orWhereIn('userId', (sub) => {
          sub.from('users').whereILike('username', `%${q}%`).select('id')
        })
      })
    }

    if (postId) {
      commentsQuery.where('postId', postId)
    }

    commentsQuery.orderBy('createdAt', 'desc')

    const paginatedComments = await commentsQuery.paginate(page, limit)

    return inertia.render('admin/comments/index', {
      comments: CommentTransformer.paginate(paginatedComments.all(), paginatedComments.getMeta()),
      q,
      postId,
    })
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    try {
      const comment = await Comment.findOrFail(params.id)
      await bouncer.with('CommentPolicy').authorize('delete', comment)

      const childrenCount = await comment.related('responses').query().count('* as total')
      const hasChildren = Number((childrenCount[0] as any).$extras.total) > 0

      if (hasChildren) {
        comment.stateId = CommentStateIds.ARCHIVED
        comment.userId = null
        comment.body = '[deleted]'
        await comment.save()
      } else {
        await comment.delete()
      }

      session.flash('success', 'Comment deleted successfully')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', 'Failed to delete comment.')
      return response.redirect().back()
    }
  }
}
