import { Link } from '@adonisjs/inertia/react'
import type { Data } from '@generated/data'
import React from 'react'

import { SEOHead } from '~/components/seo_head'
import ScrollReveal from '~/components/scroll_reveal'
import { Badge } from '~/components/ui/badge'
import { buttonVariants } from '~/components/ui/button'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import DefaultLayout from '~/layouts/default'
import type { InertiaProps } from '~/types'

type PageProps = InertiaProps<{
  post: Data.Post
}>

function stripHtml(input?: string | null) {
  if (!input) return ''

  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export default function BlogsShow({ post }: PageProps) {
  const body = post.body || ''
  const bodyRef = React.useRef<HTMLDivElement>(null)
  const authors = post.authors ?? []
  const taxonomies = post.taxonomies ?? []
  const primaryAuthor = authors[0]?.username

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
        author={primaryAuthor || undefined}
      />

      <div className="px-5 py-10">
        <div className="container mx-auto grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <ScrollReveal>
            <div className="space-y-8">
              <div className="flex items-center justify-between gap-4">
                <Link
                  route="blogs.index"
                  className={buttonVariants({ size: 'sm', variant: 'outline' })}
                >
                  Back to blog
                </Link>

                <Badge variant="outline">Blog</Badge>
              </div>

              <header className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  {post.publishedAtDisplay ? <span>{post.publishedAtDisplay}</span> : null}
                  {post.readMinutesDisplay ? (
                    <span>· {post.readMinutesDisplay} min read</span>
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
            </div>
          </ScrollReveal>

          <aside className="space-y-6 lg:sticky lg:top-6">
            <Card>
              <CardHeader className="border-b">
                <CardTitle>About this post</CardTitle>
                <CardDescription>Quick details and supporting metadata.</CardDescription>
              </CardHeader>
              <CardPanel className="space-y-6">
                <section className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Author</p>
                  <div className="space-y-2">
                    {authors.length ? (
                      authors.map((author) => (
                        <div key={author.id} className="rounded-lg border p-3">
                          <p className="font-medium text-foreground">{author.username}</p>
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
                  <p className="text-sm font-medium text-foreground">Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {taxonomies.length ? (
                      taxonomies.map((taxonomy) => (
                        <Badge key={taxonomy.id} variant="secondary">
                          {taxonomy.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No topics assigned.</p>
                    )}
                  </div>
                </section>
              </CardPanel>
            </Card>
          </aside>
        </div>
      </div>
    </>
  )
}

BlogsShow.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
