import type { HttpContext } from '@adonisjs/core/http'

import { PostTypes } from '#enums/posts'
import Post from '#models/post'
import Taxonomy from '#models/taxonomy'
import PostTransformer from '#transformers/post_transformer'
import TaxonomyTransformer from '#transformers/taxonomy_transformer'
import { blogIndexValidator } from '#validators/blog'

const ALLOWED_SORT_COLUMNS = ['title', 'publishedAt', 'createdAt'] as const
const DEFAULT_SORT_COLUMN = 'publishedAt'
const DEFAULT_SORT_ORDER = 'desc' as const

function isAllowedSortColumn(value?: string): value is (typeof ALLOWED_SORT_COLUMNS)[number] {
  return ALLOWED_SORT_COLUMNS.some((column) => column === value)
}

export default class BlogsController {
  async index({ inertia, request }: HttpContext) {
    const {
      topic,
      topics = [],
      sortBy,
      sortOrder,
    } = await blogIndexValidator.validate(request.qs())
    const selectedTopicSlugs = topic ? [topic] : topics
    const sortColumn = isAllowedSortColumn(sortBy) ? sortBy : DEFAULT_SORT_COLUMN
    const sortDirection = sortOrder ?? DEFAULT_SORT_ORDER

    const postsQuery = Post.blogs()
      .apply((scope) => scope.publishedPublic())
      .apply((scope) => scope.forBlogDisplay())

    if (selectedTopicSlugs.length > 0) {
      postsQuery.whereHas('taxonomies', (query) =>
        query.whereIn('slug', selectedTopicSlugs).where('type', 'Content')
      )
    }

    const posts = await postsQuery.orderBy(sortColumn, sortDirection).exec()

    const topicsRows = await Taxonomy.query()
      .where('type', 'Content')
      .whereHas('posts', (query) =>
        query.apply((scope) => scope.publishedPublic()).where('postType', PostTypes.BLOG)
      )
      .withCount('posts', (query) =>
        query
          .apply((scope) => scope.publishedPublic())
          .where('postType', PostTypes.BLOG)
          .as('posts_count')
      )
      .orderBy('posts_count', 'desc')
      .orderBy('name', 'asc')

    return inertia.render('blogs/index', {
      posts: PostTransformer.transform(posts),
      topics: TaxonomyTransformer.transform(topicsRows),
      selectedTopicSlugs,
      sortBy: sortColumn,
      sortOrder: sortDirection,
    })
  }

  async show({ inertia, params }: HttpContext) {
    const post = await Post.blogs()
      .where('slug', params.slug)
      .apply((scope) => scope.publishedPublic())
      .apply((scope) => scope.forBlogDisplayShow())
      .firstOrFail()

    return inertia.render('blogs/show', {
      post: PostTransformer.transform(post),
    })
  }
}
