import type { HttpContext } from '@adonisjs/core/http'
import Watchlist from '#models/watchlist'
import Post from '#models/post'
import Progress from '#models/progress'
import PostTransformer from '#transformers/post_transformer'
import ProgressTransformer from '#transformers/progress_transformer'
import WatchlistTransformer from '#transformers/watchlist_transformer'

async function transformWatchlistItem(
  serialize: HttpContext['serialize'],
  item: Watchlist,
  progress: Progress | null
) {
  const [watchlist, post, progressData] = await Promise.all([
    serialize(WatchlistTransformer.transform(item)),
    serialize(PostTransformer.transform(item.post)),
    progress ? serialize(ProgressTransformer.transform(progress)) : Promise.resolve(null),
  ])

  return {
    watchlist: watchlist.data,
    post: post.data,
    progress: progressData?.data ?? null,
  }
}

export default class WatchlistsController {
  async index({ inertia, auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    const watchlistItems = await Watchlist.query()
      .where('userId', user.id)
      .whereNotNull('postId')
      .preload('post', (query) => {
        query.apply((scope) => scope.publishedPublic()).apply((scope) => scope.forLessonDisplay())
      })
      .orderBy('createdAt', 'desc')

    const visibleItems = watchlistItems.filter((item) => Boolean(item.post))
    const postIds = visibleItems.map((item) => item.post.id)
    const progressByPostId = new Map<string, Progress>()

    if (postIds.length > 0) {
      const progressRows = await Progress.query()
        .where('userId', user.id)
        .whereIn('postId', postIds)
      for (const progress of progressRows) {
        if (progress.postId) progressByPostId.set(progress.postId, progress)
      }
    }

    const items = await Promise.all(
      visibleItems.map((item) =>
        transformWatchlistItem(serialize, item, progressByPostId.get(item.post.id) ?? null)
      )
    )

    return inertia.render('users/watchlist', { items })
  }

  async toggleLesson({ response, auth, params }: HttpContext) {
    const user = auth.getUserOrFail()
    const lesson = await Post.lessons().where('slug', params.slug).firstOrFail()
    const existing = await Watchlist.query()
      .where('userId', user.id)
      .where('postId', lesson.id)
      .first()

    if (existing) {
      await existing.delete()
    } else {
      await Watchlist.create({ userId: user.id, postId: lesson.id })
    }

    return response.redirect().back()
  }
}
