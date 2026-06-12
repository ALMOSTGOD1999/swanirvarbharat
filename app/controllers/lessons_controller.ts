import type { HttpContext } from '@adonisjs/core/http'

import { PostTypes } from '#enums/posts'
import { AccessLevels } from '#enums/access_levels'
import { LessonPanels } from '#enums/lesson_panels'
import Post from '#models/post'
import Progress from '#models/progress'
import Taxonomy from '#models/taxonomy'
import Watchlist from '#models/watchlist'
import AssetTransformer from '#transformers/asset_transformer'
import PostTransformer from '#transformers/post_transformer'
import ProgressTransformer from '#transformers/progress_transformer'
import TaxonomyTransformer from '#transformers/taxonomy_transformer'
import UserTransformer from '#transformers/user_transformer'
import LessonAccessService from '#services/lesson_access_service'
import { lessonIndexValidator } from '#validators/lesson'

const ALLOWED_SORT_COLUMNS = ['publishedAt', 'title', 'createdAt'] as const
const DEFAULT_SORT_BY = 'publishedAt'
const DEFAULT_SORT_ORDER = 'desc'

function isAllowedSortColumn(value?: string): value is (typeof ALLOWED_SORT_COLUMNS)[number] {
  return ALLOWED_SORT_COLUMNS.includes(value as (typeof ALLOWED_SORT_COLUMNS)[number])
}

async function transformLessonPost(serialize: HttpContext['serialize'], post: Post) {
  const [base, authors, taxonomies, thumbnails] = await Promise.all([
    serialize(PostTransformer.transform(post)),
    serialize(UserTransformer.transform(post.authors ?? [])),
    serialize(TaxonomyTransformer.transform(post.taxonomies ?? [])),
    serialize(AssetTransformer.transform(post.thumbnails ?? [])),
  ])

  return {
    ...base.data,
    authors: authors.data,
    taxonomies: taxonomies.data,
    thumbnails: thumbnails.data,
    thumbnail: thumbnails.data[0],
    publishedAtDisplay: post.publishedAtDisplay,
    readMinutesDisplay: post.readMinutesDisplay,
    watchMinutes: post.watchMinutes,
    hasVideo: Boolean(post.hasVideo),
    videoYouTubeId: post.videoYouTubeId,
    videoDriveId: post.videoDriveId,
    videoEmbedUrl: post.videoEmbedUrl,
  }
}

export default class LessonsController {
  async index({ inertia, request }: HttpContext) {
    const {
      topic,
      topics = [],
      sortBy,
      sortOrder = DEFAULT_SORT_ORDER,
    } = await lessonIndexValidator.validate(request.qs())

    const selectedTopicSlugs = topic ? [topic] : topics
    const safeSortBy = isAllowedSortColumn(sortBy) ? sortBy : DEFAULT_SORT_BY
    const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc'

    const lessonsQuery = Post.lessons()
      .apply((scope) => scope.publishedPublic())
      .apply((scope) => scope.forLessonDisplay())

    if (selectedTopicSlugs.length > 0) {
      lessonsQuery.whereHas('taxonomies', (query) => {
        query.whereIn('slug', selectedTopicSlugs).where('type', 'Content')
      })
    }

    const lessons = await lessonsQuery.orderBy(safeSortBy, safeSortOrder).exec()

    const topicsForLessons = await Taxonomy.query()
      .where('type', 'Content')
      .whereHas('posts', (query) => {
        query.apply((scope) => scope.publishedPublic()).where('postType', PostTypes.LESSON)
      })
      .withCount('posts', (query) => {
        query
          .apply((scope) => scope.publishedPublic())
          .where('postType', PostTypes.LESSON)
          .as('posts_count')
      })
      .orderBy('posts_count', 'desc')
      .orderBy('name', 'asc')

    return inertia.render('lessons/index', {
      lessons: PostTransformer.transform(lessons),
      topics: TaxonomyTransformer.transform(topicsForLessons),
      selectedTopicSlugs,
      sortBy: safeSortBy,
      sortOrder: safeSortOrder,
    })
  }

  async show({ inertia, params, auth, session, serialize }: HttpContext) {
    const lesson = await Post.lessons()
      .where('slug', params.slug)
      .apply((scope) => scope.publishedPublic())
      .apply((scope) => scope.forLessonDisplayShow())
      .firstOrFail()

    const access = await LessonAccessService.check(lesson, auth.user)
    const progress = auth.user
      ? await Progress.query().where('userId', auth.user.id).where('postId', lesson.id).first()
      : null
    const watchlist = auth.user
      ? await Watchlist.query().where('userId', auth.user.id).where('postId', lesson.id).first()
      : null
    const lessonPost = await transformLessonPost(serialize, lesson)
    if (!access.allowed) {
      lessonPost.body = ''
      lessonPost.videoUrl = null
      lessonPost.videoBunnyId = null
      lessonPost.videoYouTubeId = ''
    }
    const serializedProgress = progress
      ? await serialize(ProgressTransformer.transform(progress))
      : null

    return inertia.render('lessons/show', {
      lesson: lessonPost,
      progress: serializedProgress?.data ?? null,
      isInWatchlist: Boolean(watchlist),
      access,
      preferences: {
        autoplayNext: auth.user
          ? auth.user.isEnabledAutoplayNext
          : session.get('autoplayNext', 'true') === 'true',
        defaultPanel:
          auth.user?.resolvedDefaultLessonPanel ||
          session.get('defaultLessonPanel', LessonPanels.OVERVIEW),
      },
      accessLevels: AccessLevels,
    })
  }
}
