import type { HttpContext } from '@adonisjs/core/http'

import PostTransformer from '#transformers/post_transformer'
import TaxonomyTransformer from '#transformers/taxonomy_transformer'
import Taxonomy from '#models/taxonomy'

export default class TopicsController {
  async index({ inertia }: HttpContext) {
    const topicsRows = await Taxonomy.query()
      .where('type', 'Content')
      .apply((scope) => scope.hasContent())
      .whereNotNull('slug')
      .whereNotNull('name')
      .withCount('posts')
      .orderBy('name')
      .orderBy('createdAt', 'asc')

    return inertia.render('topics/index', {
      topics: TaxonomyTransformer.transform(topicsRows),
    })
  }

  async show({ inertia, params }: HttpContext) {
    const topic = await Taxonomy.query()
      .where('slug', params.slug)
      .apply((scope) => scope.hasContent())
      .withCount('posts')
      .firstOrFail()

    const posts = await topic
      .related('posts')
      .query()
      .apply((scope) => scope.publishedPublic())
      .preload('thumbnails')
      .preload('authors')
      .preload('taxonomies')
      .orderBy('publishedAt', 'desc')
      .exec()

    return inertia.render('topics/show', {
      topic: TaxonomyTransformer.transform(topic),
      posts: PostTransformer.transform(posts),
    })
  }
}
