import type { HttpContext } from '@adonisjs/core/http'

import cache from '@adonisjs/cache/services/main'
import { DateTime } from 'luxon'

import { CacheNamespaces } from '#enums/cache_namespaces'
import { States } from '#enums/states'
import MemberEnrollmentService from '#services/member_enrollment_service'
import ResourceAccessService from '#services/resource_access_service'
import Series from '#models/series'
import MemberEnrollmentTransformer from '#transformers/member_enrollment_transformer'
import PostTransformer from '#transformers/post_transformer'
import SeriesTransformer from '#transformers/series_transformer'
import { seriesIndexValidator } from '#validators/series'

export default class SeriesController {
  async index({ inertia, request }: HttpContext) {
    await seriesIndexValidator.validate(request.qs())
    const series = await cache.namespace(CacheNamespaces.COLLECTIONS).getOrSet({
      key: `GET_SERIES_LIST`,
      factory: async () => {
        const rows = await Series.query()
          .whereHas('posts', (query) => query.apply((scope) => scope.published()))
          .withCount('posts', (query) =>
            query.apply((scope) => scope.published()).as('posts_count')
          )
          .withAggregate('posts', (query) =>
            query
              .apply((scope) => scope.published())
              .sum('video_seconds')
              .as('video_seconds_sum')
          )
          .apply((scope) => scope.withPostLatestPublished())
          .orderBy('latest_published_at', 'desc')

        return rows.map((row) => ({
          id: row.id,
          name: row.name,
          slug: row.slug,
          description: row.description,
          postsCount: Number(row.$extras.posts_count ?? 0),
          videoSecondsSum: Number(row.$extras.video_seconds_sum ?? 0),
        }))
      },
    })

    return inertia.render('series/index', { series })
  }

  async show({ inertia, params, auth, serialize }: HttpContext) {
    const series = await Series.query()
      .where('slug', params.slug)
      .preload('owner')
      .preload('asset')
      .preload('taxonomies')
      .preload('accessLevel')
      .firstOrFail()

    const posts = await series
      .related('posts')
      .query()
      .where('state', States.PUBLIC)
      .where('publishedAt', '<=', DateTime.now().toSQL()!)

    posts.sort((left, right) => {
      const leftOrder = Number(left.$extras.pivot_sort_order ?? 0)
      const rightOrder = Number(right.$extras.pivot_sort_order ?? 0)

      return leftOrder - rightOrder
    })

    const resource = { type: 'series', model: series } as const
    const access = await ResourceAccessService.forResource(resource, auth.user)
    const currentEnrollment = auth.user
      ? await MemberEnrollmentService.currentEnrollment(auth.user, resource)
      : null
    const [serializedSeries, serializedPosts, serializedEnrollment] = await Promise.all([
      serialize(SeriesTransformer.transform(series)),
      serialize(PostTransformer.transform(posts)),
      currentEnrollment
        ? serialize(MemberEnrollmentTransformer.transform(currentEnrollment))
        : Promise.resolve(null),
    ])

    return inertia.render('series/show', {
      series: serializedSeries.data,
      posts: serializedPosts.data,
      access: {
        allowed: access.allowed,
        levelName: access.levelName,
        reason: access.reason,
      },
      enrollment: serializedEnrollment?.data ?? null,
      enrollmentSummary: access.enrollment
        ? {
            attemptsUsed: access.enrollment.attemptsUsed,
            attemptsRemaining: access.enrollment.attemptsRemaining,
            maxAttempts: access.enrollment.maxAttempts,
            canApply: access.enrollment.canApply,
          }
        : null,
    })
  }
}
