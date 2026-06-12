import type { HttpContext } from '@adonisjs/core/http'
import { createPostValidator, filterPostsValidator, updatePostValidator } from '#validators/post'
import Post from '#models/post'
import User from '#models/user'
import Asset from '#models/asset'
import db from '@adonisjs/lucid/services/db'
import { attachmentManager } from '@jrmc/adonis-attachment'
import { cuid } from '#utils/id'
import PostTransformer from '#transformers/post_transformer'
import { PostTypes } from '#enums/posts'
import ThumbnailService from '#services/thumbnail_service'

const postTypeQueryFactories = {
  [PostTypes.LESSON]: () => Post.lessons(),
  [PostTypes.BLOG]: () => Post.blogs(),
  [PostTypes.NEWS]: () => Post.news(),
  [PostTypes.LIVESTREAM]: () => Post.livestreams(),
  [PostTypes.LINK]: () => Post.links(),
  [PostTypes.SNIPPET]: () => Post.snippets(),
} satisfies Record<string, () => ReturnType<typeof Post.query>>

const ALLOWED_SORT_COLUMNS = ['title', 'publishedAt', 'updatedAt', 'createdAt'] as const
const DEFAULT_SORT_COLUMN = 'publishedAt'
const DEFAULT_SORT_ORDER = 'desc' as const

export default class PostsController {
  async index({ inertia, request, bouncer }: HttpContext) {
    await bouncer.with('PostPolicy').authorize('viewList')
    const {
      page = 1,
      limit = 10,
      q = '',
      types = [],
      states = [],
      authorIds = [],
      taxonomyNames = [],
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
    } = await filterPostsValidator.validate(request.qs())

    const postsQuery =
      types.length === 1 && postTypeQueryFactories[types[0]]
        ? postTypeQueryFactories[types[0]]()
        : Post.query()

    if (types.length > 1) {
      postsQuery.whereIn('postType', types)
    }

    if (q) postsQuery.whereILike('title', `%${q}%`)

    if (states.length > 0) {
      postsQuery.whereIn('state', states)
    }

    if (authorIds.length > 0) {
      postsQuery.whereHas('authors', (q) => q.whereIn('users.id', authorIds))
    }

    if (taxonomyNames.length > 0) {
      postsQuery.whereHas('taxonomies', (q) => q.whereIn('taxonomies.name', taxonomyNames))
    }

    if (dateFrom) {
      postsQuery.where('publishedAt', '>=', dateFrom)
    }

    if (dateTo) {
      postsQuery.where('publishedAt', '<=', dateTo)
    }

    const sortColumn = ALLOWED_SORT_COLUMNS.includes(sortBy as any) ? sortBy! : DEFAULT_SORT_COLUMN
    const sortDirection = sortOrder ?? DEFAULT_SORT_ORDER

    const paginatedPosts = await postsQuery
      .preload('authors')
      .preload('thumbnails')
      .preload('taxonomies')
      .orderBy(sortColumn, sortDirection)
      .paginate(page, limit)

    paginatedPosts.queryString(request.qs())

    // Fetch filter options for the frontend
    const allAuthors = await User.query()
      .select(['id', 'username', 'email'])
      .preload('profile')
      .orderBy('username')

    return inertia.render('admin/posts/index', {
      posts: PostTransformer.paginate(paginatedPosts.all(), paginatedPosts.getMeta()),
      q,
      types,
      states,
      authorIds,
      taxonomyNames,
      dateFrom: dateFrom ?? '',
      dateTo: dateTo ?? '',
      sortBy: sortBy ?? 'publishedAt',
      sortOrder: sortOrder ?? 'desc',
      allAuthors: allAuthors.map((u) => ({
        id: u.id,
        name: u.profile?.name || u.username || u.email,
      })),
    })
  }

  async create({ inertia, bouncer }: HttpContext) {
    await bouncer.with('PostPolicy').authorize('create')
    return inertia.render('admin/posts/form', {})
  }

  async store({ auth, request, response, session, bouncer }: HttpContext) {
    await bouncer.with('PostPolicy').authorize('create')
    const {
      taxonomyIds = [],
      thumbnail,
      ...payload
    } = await request.validateUsing(createPostValidator)
    const user = auth.getUserOrFail()

    const trx = await db.transaction()

    try {
      const post = await Post.create(payload, { client: trx })

      await post.related('authors').attach({ [user.id]: { id: cuid(24) } })
      await post.related('taxonomies').sync(taxonomyIds, false)
      await ThumbnailService.handleCreate(post, thumbnail, 'thumbnails', trx)

      await trx.commit()

      session.flash('success', 'Post created successfully.')
      return response.redirect().toRoute('admin.posts.edit', { id: post.slug })
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Some error occurred. Your post was not created.')
      throw error
    }
  }

  async edit({ params, serialize, inertia, bouncer }: HttpContext) {
    const post = await Post.query()
      .where('id', params.id)
      .orWhere('slug', params.id)
      .preload('thumbnails')
      .firstOrFail()
    await bouncer.with('PostPolicy').authorize('update')
    const p = await serialize(PostTransformer.transform(post))

    return inertia.render('admin/posts/form', { post: p.data })
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    const {
      taxonomyIds = [],
      thumbnail,
      ...payload
    } = await request.validateUsing(updatePostValidator)

    const post = await Post.query().where('id', params.id).preload('thumbnails').firstOrFail()
    await bouncer.with('PostPolicy').authorize('update')

    const trx = await db.transaction()

    try {
      post.useTransaction(trx)
      post.merge(payload)
      await post.save()

      await post.related('taxonomies').sync(taxonomyIds, false)
      await ThumbnailService.handleUpdate(post, thumbnail, 'thumbnails', trx)

      await trx.commit()

      session.flash('success', 'Post updated successfully.')
      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to update post.')
      throw error
    }
  }

  async destroy({ params, response, session, bouncer }: HttpContext) {
    const post = await Post.query().where('id', params.id).firstOrFail()
    await bouncer.with('PostPolicy').authorize('delete')

    const trx = await db.transaction()

    try {
      // Detach relationships
      await post.related('authors').detach()
      await post.related('taxonomies').detach()

      // Delete chapters and snapshots
      await post.related('chapters').query().useTransaction(trx).delete()
      await post.related('snapshots').query().useTransaction(trx).delete()

      // Destroy comments (with comment_votes cleanup)
      const comments = await post.related('comments').query().useTransaction(trx).select('id')
      const commentIds = comments.map((c) => c.id)
      if (commentIds.length) {
        await trx.from('comment_votes').whereIn('comment_id', commentIds).delete()
      }
      await post.related('comments').query().useTransaction(trx).delete()

      // Destroy unused assets
      const assets = await post.related('assets').query().useTransaction(trx).select(['id'])
      const assetIds = assets.map((a) => a.id)
      if (assetIds.length) {
        const unusedAssets = await Asset.query({ client: trx })
          .whereIn('id', assetIds)
          .whereDoesntHave('posts', (q) => q.whereNot('id', post.id))
          .whereDoesntHave('taxonomies', (q) => q)

        await post.related('assets').detach()
        for (const asset of unusedAssets) {
          await attachmentManager.remove(asset.asset)
          await asset.delete()
        }
      }

      await post.useTransaction(trx).delete()
      await trx.commit()

      session.flash('success', 'Post deleted successfully.')
      return response.redirect().toRoute('admin.posts.index')
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Failed to delete post.')
      throw error
    }
  }
}
