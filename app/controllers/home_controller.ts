import type { HttpContext } from '@adonisjs/core/http'
import { States } from '#enums/states'
import Series from '#models/series'
import Post from '#models/post'
import Taxonomy from '#models/taxonomy'
import PostTransformer from '#transformers/post_transformer'
import SeriesTransformer from '#transformers/series_transformer'
import TaxonomyTransformer from '#transformers/taxonomy_transformer'

export default class HomeController {
  async index({ inertia }: HttpContext) {
    const [featuredSeries, latestPosts, topics, stats] = await Promise.all([
      // Featured series (top 4 with most posts)
      Series.query()
        .where('state', States.PUBLIC)
        .whereHas('posts', (query) => query.apply((scope) => scope.published()))
        .withCount('posts', (query) => query.apply((scope) => scope.published()).as('posts_count'))
        .withAggregate('posts', (query) =>
          query
            .apply((scope) => scope.published())
            .sum('video_seconds')
            .as('video_seconds_sum')
        )
        .apply((scope) => scope.withPostLatestPublished())
        .orderBy('latest_published_at', 'desc')
        .limit(4),

      // Latest posts (6 most recent)
      Post.query()
        .apply((scope) => scope.publishedPublic())
        .preload('thumbnails')
        .preload('authors', (a) => a.preload('profile'))
        .preload('taxonomies')
        .orderBy('publishedAt', 'desc')
        .limit(6),

      // Top topics with post counts
      Taxonomy.query()
        .where('type', 'Content')
        .whereHas('posts', (query) => query.apply((scope) => scope.published()))
        .withCount('posts', (query) => query.apply((scope) => scope.published()).as('posts_count'))
        .orderBy('posts_count', 'desc')
        .limit(8),

      // Stats
      Promise.all([
        Post.query()
          .apply((scope) => scope.publishedPublic())
          .count('* as total')
          .first(),
        Series.query()
          .whereHas('posts', (q) => q.apply((scope) => scope.published()))
          .count('* as total')
          .first(),
        Taxonomy.query()
          .where('type', 'Content')
          .whereHas('posts', (q) => q.apply((scope) => scope.published()))
          .count('* as total')
          .first(),
      ]),
    ])

    return inertia.render('home', {
      featuredSeries: SeriesTransformer.transform(featuredSeries),
      latestPosts: PostTransformer.transform(latestPosts),
      topics: TaxonomyTransformer.transform(topics),
      stats: {
        posts: Number((stats[0] as any)?.$extras?.total ?? stats[0]?.id ?? 0),
        series: Number((stats[1] as any)?.$extras?.total ?? stats[1]?.id ?? 0),
        topics: Number((stats[2] as any)?.$extras?.total ?? stats[2]?.id ?? 0),
      },
    })
  }
}
