import type { HttpContext } from '@adonisjs/core/http'

import { PostTypes } from '#enums/posts'
import AssetTransformer from '#transformers/asset_transformer'
import PostTransformer from '#transformers/post_transformer'
import TaxonomyTransformer from '#transformers/taxonomy_transformer'
import UserTransformer from '#transformers/user_transformer'
import CommentTransformer from '#transformers/comment_transformer'
import { filterPostsValidator } from '#validators/post'
import Post from '#models/post'
import { CommentStateIds } from '#enums/comment_state_ids'

function buildPostQuery(postType?: string) {
  switch (postType) {
    case PostTypes.LESSON:
      return Post.lessons()
    case PostTypes.BLOG:
      return Post.blogs()
    case PostTypes.NEWS:
      return Post.news()
    case PostTypes.LIVESTREAM:
      return Post.livestreams()
    case PostTypes.LINK:
      return Post.links()
    case PostTypes.SNIPPET:
      return Post.snippets()
    default:
      return Post.query()
  }
}

async function transformPublicPost(post: Post): Promise<any> {
  const [base, authors, taxonomies, thumbnails] = await Promise.all([
    PostTransformer.transform(post),
    UserTransformer.transform(post.authors ?? []),
    TaxonomyTransformer.transform(post.taxonomies ?? []),
    AssetTransformer.transform(post.thumbnails ?? []),
  ])

  return {
    ...base,
    authors: Array.isArray(authors) ? authors : [],
    taxonomies: Array.isArray(taxonomies) ? taxonomies : [],
    thumbnails: Array.isArray(thumbnails) ? thumbnails : [],
    thumbnail: Array.isArray(thumbnails) ? thumbnails[0] : undefined,
    series: [],
    rootSeries: [],
    publishedAtDisplay: post.publishedAtDisplay,
    readMinutesDisplay: post.readMinutesDisplay,
  }
}

function applyDisplayPreloads(query: any, postType?: string) {
  switch (postType) {
    case PostTypes.LESSON:
      query.apply((scope: any) => scope.forLessonDisplay())
      break
    case PostTypes.BLOG:
      query.apply((scope: any) => scope.forBlogDisplay())
      break
    default:
      query.preload('thumbnails').preload('authors').preload('taxonomies')
  }
}

export default class PostsController {
  async index({ inertia, request }: HttpContext) {
    const { page = 1, limit = 12, types = [] } = await filterPostsValidator.validate(request.qs())

    const postsQuery = types.length === 1 ? buildPostQuery(types[0]) : Post.query()

    postsQuery.apply((scope) => scope.publishedPublic())

    if (types.length > 1) {
      postsQuery.whereIn('postType', types)
    }

    if (types.length === 1) {
      applyDisplayPreloads(postsQuery, types[0])
    } else {
      applyDisplayPreloads(postsQuery)
    }

    const paginatedPosts = await postsQuery.orderBy('publishedAt', 'desc').paginate(page, limit)
    paginatedPosts.queryString(request.qs())

    const posts = await Promise.all(paginatedPosts.all().map((post) => transformPublicPost(post)))

    return inertia.render('posts/index', {
      posts: {
        data: posts,
        metadata: paginatedPosts.getMeta(),
      },
      types,
    } as any)
  }

  async show({ inertia, params, auth }: HttpContext) {
    const post = await Post.query()
      .where('slug', params.slug)
      .apply((scope) => scope.publishedPublic())
      .firstOrFail()

    const hydratedQuery = Post.query()
      .where('id', post.id)
      .apply((scope) => scope.publishedPublic())

    applyDisplayPreloads(hydratedQuery, post.postType)

    const hydratedPost = await hydratedQuery.firstOrFail()

    await hydratedPost.load('comments', (query) => {
      query.preload('user', (u) => u.preload('profile'))
      query.preload('userVotes', (v) => v.select('id'))
      query.where('stateId', '!=', CommentStateIds.ARCHIVED)
      query.orderBy('createdAt', 'asc')
    })

    const transformedPost = await transformPublicPost(hydratedPost)
    const transformedComments = await CommentTransformer.transform(hydratedPost.comments)

    return inertia.render('posts/show', {
      post: transformedPost,
      comments: transformedComments,
      currentUserId: auth.user?.id || null,
    } as any)
  }
}
