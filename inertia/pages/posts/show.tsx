import { Link } from '@adonisjs/inertia/react'
import { SEOHead } from '~/components/seo_head'
import { ArticleJsonLd } from '~/components/json_ld'
import ScrollReveal from '~/components/scroll_reveal'
import { ArrowLeft, CalendarDays, Clock3, Hash, Tag, Users } from 'lucide-react'
import React from 'react'

import { Badge } from '~/components/ui/badge'
import { buttonVariants } from '~/components/ui/button'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import CommentsSection from '~/components/comments/comments_section'
import DefaultLayout from '~/layouts/default'
import type { InertiaProps } from '~/types'
import type { Data } from '@generated/data'

type PostType = string

type PublicPost = {
  id: string
  slug: string
  title: string
  postType: PostType
  body?: string | null
  description?: string | null
  pageTitle?: string | null
  publishedAt?: string | null
  readMinutesDisplay?: string
  publishedAtDisplay?: string
  lessonIndexDisplay?: string
  rootIndexDisplay?: string
  thumbnail?: {
    url: string
    altText?: string | null
  }
  authors?: Array<{
    id: string
    username: string
    profile?: { name?: string | null } | null
  }>
  taxonomies?: Array<{ id: string; name: string }>
  series?: Array<{
    id: string
    name: string
    slug: string
    indexDisplay?: string
  }>
  rootSeries?: Array<{
    id: string
    name: string
    slug: string
    indexDisplay?: string
  }>
}

type PageProps = InertiaProps<{
  post: PublicPost
  comments: Data.Comment[]
  currentUserId: string | null
}>

function stripHtml(input?: string | null) {
  if (!input) return ''
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export default function PostsShow({ post, comments, currentUserId }: PageProps) {
  const publishedLabel = post.publishedAtDisplay || post.publishedAt || ''
  const body = post.body || ''
  const authors = post.authors ?? []
  const taxonomies = post.taxonomies ?? []
  const seriesList = post.series ?? []
  const rootSeries = post.rootSeries ?? []
  const bodyRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = bodyRef.current
    if (!el) return

    el.replaceChildren()
    if (!body) return

    const doc = new DOMParser().parseFromString(body, 'text/html')
    el.append(...Array.from(doc.body.childNodes))
  }, [body])

  return (
    <>
      <SEOHead
        title={post.pageTitle || post.title}
        description={post.description || undefined}
        type="article"
        publishedTime={post.publishedAt || undefined}
        author={authors[0]?.profile?.name || authors[0]?.username || undefined}
      />
      <ArticleJsonLd
        title={post.title}
        description={post.description || undefined}
        image={post.thumbnail?.url}
        url={`/posts/${post.slug}`}
        publishedTime={post.publishedAt || undefined}
        author={authors[0]?.profile?.name || authors[0]?.username}
      />
      <div className="px-5 py-10">
        <div className="container mx-auto grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <ScrollReveal>
            <div className="space-y-8">
              <div className="flex items-center justify-between gap-4">
                <Link href="/posts" className={buttonVariants({ size: 'sm', variant: 'outline' })}>
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Back to posts
                </Link>

                {post.postType ? <Badge variant="outline">{post.postType}</Badge> : null}
              </div>

              <header className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  {publishedLabel ? (
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-4" aria-hidden="true" />
                      {publishedLabel}
                    </span>
                  ) : null}
                  {post.readMinutesDisplay ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="size-4" aria-hidden="true" />
                      {post.readMinutesDisplay} min read
                    </span>
                  ) : null}
                  {post.lessonIndexDisplay ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Hash className="size-4" aria-hidden="true" />
                      {post.lessonIndexDisplay}
                    </span>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                    {post.title}
                  </h1>
                  {post.description ? (
                    <p className="max-w-3xl text-lg text-muted-foreground">{post.description}</p>
                  ) : null}
                </div>
              </header>

              {post.thumbnail?.url ? (
                <div className="overflow-hidden rounded-2xl border bg-card">
                  <img
                    src={post.thumbnail.url}
                    alt={post.thumbnail.altText || post.title}
                    className="aspect-[16/9] w-full object-cover"
                  />
                </div>
              ) : null}

              <article className="space-y-6">
                <div className="space-y-4 text-base leading-7 text-foreground">
                  {post.body ? (
                    <div ref={bodyRef} className="space-y-4" />
                  ) : (
                    <p>{stripHtml(post.description) || 'No content available for this post.'}</p>
                  )}
                </div>
              </article>

              <CommentsSection
                postId={post.id}
                comments={comments}
                currentUserId={currentUserId ?? undefined}
              />
            </div>
          </ScrollReveal>

          <aside className="space-y-6 lg:sticky lg:top-6">
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Post details</CardTitle>
                <CardDescription>Author, taxonomies, and series information.</CardDescription>
              </CardHeader>
              <CardPanel className="space-y-6">
                <section className="space-y-3">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <Users className="size-4 text-muted-foreground" aria-hidden="true" />
                    Author{authors.length > 1 ? 's' : ''}
                  </p>
                  <div className="space-y-2">
                    {authors.length ? (
                      authors.map((author) => (
                        <div key={author.id} className="rounded-lg border p-3">
                          <p className="font-medium text-foreground">
                            {author.profile?.name || author.username}
                          </p>
                          <p className="text-sm text-muted-foreground">@{author.username}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No author available.</p>
                    )}
                  </div>
                </section>

                <Separator />

                <section className="space-y-3">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <Tag className="size-4 text-muted-foreground" aria-hidden="true" />
                    Taxonomies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {taxonomies.length ? (
                      taxonomies.map((taxonomy) => (
                        <Badge key={taxonomy.id} variant="secondary">
                          {taxonomy.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No taxonomies assigned.</p>
                    )}
                  </div>
                </section>

                <Separator />

                <section className="space-y-3">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <Hash className="size-4 text-muted-foreground" aria-hidden="true" />
                    Series
                  </p>
                  <div className="space-y-2">
                    {seriesList.length ? (
                      seriesList.map((series) => (
                        <div key={series.id} className="rounded-lg border p-3">
                          <p className="font-medium text-foreground">
                            {series.indexDisplay ? `${series.indexDisplay} · ` : ''}
                            {series.name}
                          </p>
                          <p className="text-sm text-muted-foreground">{series.slug}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No series attached.</p>
                    )}
                  </div>
                </section>

                {rootSeries.length ? (
                  <>
                    <Separator />
                    <section className="space-y-3">
                      <p className="flex items-center gap-2 text-sm font-medium">
                        <Hash className="size-4 text-muted-foreground" aria-hidden="true" />
                        Root series
                      </p>
                      <div className="space-y-2">
                        {rootSeries.map((series) => (
                          <div key={series.id} className="rounded-lg border p-3">
                            <p className="font-medium text-foreground">
                              {series.indexDisplay ? `${series.indexDisplay} · ` : ''}
                              {series.name}
                            </p>
                            <p className="text-sm text-muted-foreground">{series.slug}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                ) : null}
              </CardPanel>
            </Card>

            <Link href="/posts" className={buttonVariants({ variant: 'outline' })}>
              Browse more posts
            </Link>
          </aside>
        </div>
      </div>
    </>
  )
}

PostsShow.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
