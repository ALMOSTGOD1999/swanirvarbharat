import { Link } from '@adonisjs/inertia/react'
import { SEOHead } from '~/components/seo_head'
import ScrollReveal from '~/components/scroll_reveal'
import {
  BookText,
  Link as LinkIcon,
  Newspaper,
  PlayCircle,
  Sparkles,
  StickyNote,
} from 'lucide-react'
import type React from 'react'

import { PostTypes } from '#enums/posts'
import { Badge } from '~/components/ui/badge'
import { buttonVariants } from '~/components/ui/button'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '~/components/ui/card'
import DefaultLayout from '~/layouts/default'
import { cn } from '~/lib/utils'
import type { InertiaProps } from '~/types'

type PostType = (typeof PostTypes)[keyof typeof PostTypes]

type PaginatorMeta = {
  perPage: number
  currentPage: number
  lastPage: number
  total: number
  firstPage?: number
  firstPageUrl?: string
  lastPageUrl?: string
  nextPageUrl?: string | null
  previousPageUrl?: string | null
}

type PublicPost = {
  id: string
  slug: string
  title: string
  postType: PostType
  body?: string | null
  description?: string | null
  thumbnail?: {
    url: string
    altText?: string | null
  }
  authors: Array<{
    id: string
    username: string
    profile?: { name?: string | null } | null
  }>
  taxonomies: Array<{ id: string; name: string }>
  series: Array<{
    id: string
    name: string
    slug: string
    indexDisplay?: string
  }>
  publishedAtDisplay?: string
  lessonIndexDisplay?: string
}

type PageProps = InertiaProps<{
  types: PostType[]
  posts: { data: PublicPost[]; metadata: PaginatorMeta }
}>

const typeFilters = [
  { label: 'All', value: [] as PostType[] },
  { label: 'Lessons', value: [PostTypes.LESSON] as PostType[] },
  { label: 'Blogs', value: [PostTypes.BLOG] as PostType[] },
  { label: 'Snippets', value: [PostTypes.SNIPPET] as PostType[] },
  { label: 'News', value: [PostTypes.NEWS] as PostType[] },
  { label: 'Livestreams', value: [PostTypes.LIVESTREAM] as PostType[] },
  { label: 'Links', value: [PostTypes.LINK] as PostType[] },
]

function buildPostsHref(types: PostType[], limit: number) {
  const params = new URLSearchParams()

  for (const type of types) params.append('types', type)
  if (limit) params.set('limit', String(limit))

  const query = params.toString()
  return query ? `/posts?${query}` : '/posts'
}

function stripHtml(input?: string | null) {
  if (!input) return ''
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function excerpt(post: PublicPost) {
  const source = post.description || stripHtml(post.body)

  if (!source) return 'Read the full post to explore the details.'
  if (source.length <= 180) return source
  return `${source.slice(0, 177).trim()}…`
}

function postTypeIcon(postType: PostType) {
  switch (postType) {
    case PostTypes.LESSON:
      return <BookText className="size-4" aria-hidden="true" />
    case PostTypes.BLOG:
      return <Newspaper className="size-4" aria-hidden="true" />
    case PostTypes.SNIPPET:
      return <StickyNote className="size-4" aria-hidden="true" />
    case PostTypes.LIVESTREAM:
      return <PlayCircle className="size-4" aria-hidden="true" />
    case PostTypes.LINK:
      return <LinkIcon className="size-4" aria-hidden="true" />
    default:
      return <Sparkles className="size-4" aria-hidden="true" />
  }
}

export default function PostsIndex({ types = [], posts }: PageProps) {
  const activeTypes = types || []
  const currentFilter = typeFilters.find(
    (filter) =>
      filter.value.length === activeTypes.length &&
      filter.value.every((type, index) => type === activeTypes[index])
  )?.label

  return (
    <>
      <SEOHead
        title="Posts"
        description="Browse lessons, blog posts, snippets, and more. Free learning resources on a wide range of topics."
      />
      <div className="px-5 py-10">
        <div className="container mx-auto flex flex-col gap-10">
          <section className="flex flex-col gap-5">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Posts
              </p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Learn from lessons, blogs, snippets, and more.
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                Browse public Swanirvarbharat posts by type and jump into the latest published
                content.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {typeFilters.map((filter) => {
                const isActive =
                  filter.value.length === activeTypes.length &&
                  filter.value.every((type, index) => type === activeTypes[index])

                return (
                  <Link
                    key={filter.label}
                    href={buildPostsHref(filter.value, posts.metadata.perPage)}
                    className={cn(
                      buttonVariants({
                        size: 'sm',
                        variant: isActive ? 'default' : 'outline',
                      })
                    )}
                  >
                    {filter.label}
                  </Link>
                )
              })}
            </div>
          </section>

          <section className="grid gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <p>
                {posts.metadata.total} public posts
                {currentFilter ? <span className="ml-2">· {currentFilter}</span> : null}
              </p>
              <p>
                Page {posts.metadata.currentPage} of {posts.metadata.lastPage}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.data.map((post, i) => (
                <ScrollReveal key={post.id} delay={i * 0.05}>
                  <Card className="overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="border-b bg-muted/30">
                      {post.thumbnail?.url ? (
                        <img
                          src={post.thumbnail.url}
                          alt={post.thumbnail.altText || post.title}
                          className="aspect-[16/9] w-full object-cover"
                        />
                      ) : (
                        <div className="flex aspect-[16/9] items-center justify-center text-muted-foreground">
                          {postTypeIcon(post.postType)}
                        </div>
                      )}
                    </div>

                    <CardHeader className="gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{post.postType}</Badge>
                        {post.lessonIndexDisplay ? (
                          <Badge variant="outline">{post.lessonIndexDisplay}</Badge>
                        ) : null}
                        {post.publishedAtDisplay ? (
                          <span className="text-xs text-muted-foreground">
                            {post.publishedAtDisplay}
                          </span>
                        ) : null}
                      </div>

                      <CardTitle className="text-xl leading-tight">
                        <Link
                          href={`/posts/${post.slug}`}
                          className="transition-colors hover:text-primary"
                        >
                          {post.title}
                        </Link>
                      </CardTitle>

                      <CardDescription>{excerpt(post)}</CardDescription>
                    </CardHeader>

                    <CardPanel className="pt-0">
                      <div className="flex flex-col gap-4 border-t pt-4 text-sm text-muted-foreground">
                        <div className="flex flex-wrap gap-2">
                          {post.taxonomies.slice(0, 4).map((taxonomy) => (
                            <Badge key={taxonomy.id} variant="secondary">
                              {taxonomy.name}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">
                              {post.authors[0]?.profile?.name ||
                                post.authors[0]?.username ||
                                'Swanirvarbharat'}
                            </p>
                            {post.series[0] ? (
                              <p>
                                {post.series[0].indexDisplay
                                  ? `${post.series[0].indexDisplay} · `
                                  : ''}
                                {post.series[0].name}
                              </p>
                            ) : null}
                          </div>

                          <Link
                            href={`/posts/${post.slug}`}
                            className={buttonVariants({
                              size: 'sm',
                              variant: 'outline',
                            })}
                          >
                            Read more
                          </Link>
                        </div>
                      </div>
                    </CardPanel>
                  </Card>
                </ScrollReveal>
              ))}
            </div>

            <div className="flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {posts.data.length} of {posts.metadata.total} posts
              </p>

              <div className="flex items-center gap-2">
                {posts.metadata.previousPageUrl ? (
                  <Link
                    href={posts.metadata.previousPageUrl}
                    className={buttonVariants({
                      size: 'sm',
                      variant: 'outline',
                    })}
                  >
                    Previous
                  </Link>
                ) : null}

                {posts.metadata.nextPageUrl ? (
                  <Link
                    href={posts.metadata.nextPageUrl}
                    className={buttonVariants({
                      size: 'sm',
                      variant: 'outline',
                    })}
                  >
                    Next
                  </Link>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

PostsIndex.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
