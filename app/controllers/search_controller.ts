import type { HttpContext } from '@adonisjs/core/http'

import { searchValidator } from '#validators/search'
import Post from '#models/post'
import Series from '#models/series'
import Taxonomy from '#models/taxonomy'
import Discussion from '#models/discussion'
import PostTransformer from '#transformers/post_transformer'
import SeriesTransformer from '#transformers/series_transformer'
import TaxonomyTransformer from '#transformers/taxonomy_transformer'
import DiscussionTransformer from '#transformers/discussion_transformer'

const EMPTY_RESULTS = {
  data: [],
  metadata: {
    currentPage: 1,
    lastPage: 1,
    perPage: 12,
    total: 0,
  },
}

const EMPTY_COUNTS = { posts: 0, series: 0, topics: 0, discussions: 0 }

export default class SearchController {
  async index({ inertia, request }: HttpContext) {
    const { q, type = 'posts' } = await searchValidator.validate(request.qs())
    const page = request.input('page', 1)
    const searchQuery = q ?? ''

    if (!searchQuery) {
      return inertia.render('search/index', {
        q: '',
        type,
        results: EMPTY_RESULTS,
        counts: EMPTY_COUNTS,
      })
    }

    // Build search conditions
    const postSearchWhere = (qb: any) =>
      qb
        .where('title', 'ilike', `%${searchQuery}%`)
        .orWhere('description', 'ilike', `%${searchQuery}%`)
    const seriesSearchWhere = (qb: any) =>
      qb
        .where('name', 'ilike', `%${searchQuery}%`)
        .orWhere('description', 'ilike', `%${searchQuery}%`)
    const topicSearchWhere = (qb: any) => qb.where('name', 'ilike', `%${searchQuery}%`)

    // Run counts in parallel
    const [postsCountResult, seriesCountResult, topicsCountResult, discussionsCountResult] =
      await Promise.all([
        Post.query()
          .apply((scope) => scope.publishedPublic())
          .where(postSearchWhere)
          .count('* as total'),
        Series.query()
          .whereHas('posts', (qb) => qb.apply((scope) => scope.published()))
          .where(seriesSearchWhere)
          .count('* as total'),
        Taxonomy.query().where(topicSearchWhere).count('* as total'),
        Discussion.query().where('title', 'ilike', `%${searchQuery}%`).count('* as total'),
      ])

    const counts = {
      posts: Number(postsCountResult[0].$extras.total ?? 0),
      series: Number(seriesCountResult[0].$extras.total ?? 0),
      topics: Number(topicsCountResult[0].$extras.total ?? 0),
      discussions: Number(discussionsCountResult[0].$extras.total ?? 0),
    }

    // Run search for active tab
    let data: any[] = []
    let metadata: any = EMPTY_RESULTS.metadata

    if (type === 'posts') {
      const paginator = await Post.query()
        .apply((scope) => scope.publishedPublic())
        .where(postSearchWhere)
        .preload('thumbnails')
        .preload('authors')
        .preload('taxonomies')
        .orderBy('publishedAt', 'desc')
        .paginate(page, 12)
      paginator.queryString(request.qs())
      data = await Promise.all(paginator.all().map((post) => PostTransformer.transform(post)))
      metadata = paginator.getMeta()
    } else if (type === 'series') {
      const paginator = await Series.query()
        .whereHas('posts', (qb) => qb.apply((scope) => scope.published()))
        .where(seriesSearchWhere)
        .withCount('posts', (qb) => qb.apply((scope) => scope.published()).as('posts_count'))
        .orderBy('createdAt', 'desc')
        .paginate(page, 12)
      paginator.queryString(request.qs())
      data = await Promise.all(paginator.all().map((s) => SeriesTransformer.transform(s)))
      metadata = paginator.getMeta()
    } else if (type === 'topics') {
      const paginator = await Taxonomy.query()
        .where(topicSearchWhere)
        .withCount('posts')
        .orderBy('name')
        .paginate(page, 24)
      paginator.queryString(request.qs())
      data = await Promise.all(paginator.all().map((t) => TaxonomyTransformer.transform(t)))
      metadata = paginator.getMeta()
    } else if (type === 'discussions') {
      const paginator = await Discussion.query()
        .where('title', 'ilike', `%${searchQuery}%`)
        .preload('user')
        .preload('taxonomy')
        .withCount('comments')
        .withCount('votes')
        .orderBy('createdAt', 'desc')
        .paginate(page, 20)
      paginator.queryString(request.qs())
      data = await Promise.all(paginator.all().map((d) => DiscussionTransformer.transform(d)))
      metadata = paginator.getMeta()
    }

    return inertia.render('search/index', {
      q: searchQuery,
      type,
      results: { data, metadata },
      counts,
    })
  }
}
