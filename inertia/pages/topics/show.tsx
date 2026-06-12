import { Link } from '@adonisjs/inertia/react'
import type { Data } from '@generated/data'
import type React from 'react'

import ScrollReveal from '~/components/scroll_reveal'
import { SEOHead } from '~/components/seo_head'
import { buttonVariants } from '~/components/ui/button'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '~/components/ui/card'
import DefaultLayout from '~/layouts/default'
import type { InertiaProps } from '~/types'

type PageProps = InertiaProps<{
  topic: Data.Taxonomy
  posts: Data.Post[]
}>

function stripHtml(input?: string | null) {
  if (!input) return ''

  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function excerpt(post: Data.Post) {
  const source = post.description || stripHtml(post.body)

  if (!source) return 'Read the full post to learn more.'
  if (source.length <= 180) return source
  return `${source.slice(0, 177).trim()}…`
}

export default function TopicsShow({ topic, posts }: PageProps) {
  return (
    <>
      <SEOHead
        title={topic.pageTitle || topic.name}
        description={topic.description || `Browse posts about ${topic.name}.`}
      />
      <div className="px-5 py-10">
        <div className="container mx-auto flex flex-col gap-10">
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-2">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Topic
                </p>
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{topic.name}</h1>
                {topic.description ? (
                  <p className="max-w-3xl text-lg text-muted-foreground">{topic.description}</p>
                ) : null}
              </div>

              <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                {topic.postsCount ?? posts.length} posts
              </span>
            </div>
          </section>

          <section className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <p>{posts.length} public posts</p>
            </div>

            <div className="grid gap-4">
              {posts.map((post, i) => (
                <ScrollReveal key={post.id} delay={i * 0.05}>
                  <Card className="overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
                    <CardHeader className="gap-2 border-b">
                      <CardTitle className="text-xl leading-tight">
                        <Link
                          route="posts.show"
                          routeParams={{ slug: post.slug }}
                          className="transition-colors hover:text-primary"
                        >
                          {post.title}
                        </Link>
                      </CardTitle>
                      <CardDescription>{excerpt(post)}</CardDescription>
                    </CardHeader>

                    <CardPanel className="flex flex-wrap items-center justify-between gap-3 pt-4">
                      <span className="text-sm text-muted-foreground">
                        {post.publishedAtDisplay || 'Unpublished'}
                      </span>
                      <Link
                        route="posts.show"
                        routeParams={{ slug: post.slug }}
                        className={buttonVariants({
                          size: 'sm',
                          variant: 'outline',
                        })}
                      >
                        Read post
                      </Link>
                    </CardPanel>
                  </Card>
                </ScrollReveal>
              ))}
            </div>

            <div className="flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">Showing {posts.length} posts</p>

              <div className="flex items-center gap-2">
                <Link
                  route="topics.index"
                  className={buttonVariants({ size: 'sm', variant: 'outline' })}
                >
                  All topics
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

TopicsShow.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
