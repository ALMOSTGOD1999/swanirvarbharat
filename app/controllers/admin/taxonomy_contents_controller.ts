import type { HttpContext } from '@adonisjs/core/http'

import Taxonomy from '#models/taxonomy'
import TaxonomyTransformer from '#transformers/taxonomy_transformer'
import PostTransformer from '#transformers/post_transformer'
import { taxonomyContentValidator } from '#validators/taxonomy'

export default class TaxonomyContentsController {
  async edit({ params, inertia, bouncer }: HttpContext) {
    const taxonomy = await Taxonomy.findOrFail(params.id)
    await bouncer.with('TaxonomyPolicy').authorize('update', taxonomy)

    const posts = await taxonomy
      .related('posts')
      .query()
      .select('id', 'title', 'slug', 'publishedAt', 'createdAt', 'updatedAt')
      .orderBy('publishedAt', 'desc')

    return inertia.render('admin/taxonomies/content', {
      taxonomy: TaxonomyTransformer.transform(taxonomy),
      posts: PostTransformer.transform(posts),
    })
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    const taxonomy = await Taxonomy.findOrFail(params.id)
    await bouncer.with('TaxonomyPolicy').authorize('update', taxonomy)
    const data = await request.validateUsing(taxonomyContentValidator)

    const posts = data.postIds.reduce<Record<string, { sort_order: number }>>(
      (acc, id, index) => ({
        ...acc,
        [id]: { sort_order: index },
      }),
      {}
    )

    await taxonomy.related('posts').sync(posts)

    session.flash('success', 'Taxonomy content updated successfully')
    return response.redirect().back()
  }
}
