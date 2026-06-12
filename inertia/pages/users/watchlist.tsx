import { Link } from '@adonisjs/inertia/react'
import type { Data } from '@generated/data'
import { router } from '@inertiajs/react'
import { BookmarkCheck, Clock3, PlayCircle, Trash2 } from 'lucide-react'
import React from 'react'

import { urlFor } from '~/client'
import { SEOHead } from '~/components/seo_head'
import { Badge } from '~/components/ui/badge'
import { Button, buttonVariants } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import DefaultLayout from '~/layouts/default'
import type { InertiaProps } from '~/types'

type WatchlistPost = Data.Post & {
  hasVideo?: boolean
  watchMinutes?: string
}

type WatchlistItem = {
  watchlist: Data.Watchlist
  post: WatchlistPost
  progress: Data.Progress | null
}

type PageProps = InertiaProps<{
  items: WatchlistItem[]
}>

function stripHtml(input?: string | null) {
  if (!input) return ''
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function excerpt(post: WatchlistPost) {
  const source = post.description || stripHtml(post.body)
  if (!source) return 'Open the lesson to continue learning.'
  if (source.length <= 150) return source
  return `${source.slice(0, 147).trim()}…`
}

function progressPercent(item: WatchlistItem) {
  if (!item.progress) return 0
  return Math.max(item.progress.readPercent ?? 0, item.progress.watchPercent ?? 0)
}

export default function WatchlistIndex({ items }: PageProps) {
  const completedCount = items.filter((item) => item.progress?.isCompleted).length

  const removeLesson = (slug: string) => {
    router.patch(
      urlFor('lessons.watchlist', { slug }),
      {},
      {
        preserveScroll: true,
        only: ['items'],
      }
    )
  }

  return (
    <>
      <SEOHead
        title="Watchlist"
        description="Your saved Swanirvarbharat lessons, progress, and next-up learning queue."
      />
      <div className="px-5 py-10">
        <div className="container mx-auto flex flex-col gap-10">
          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Watchlist
              </p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Pick up where curiosity left off.
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                Keep your saved lessons close, track what is finished, and jump back into the next
                thing you wanted to learn.
              </p>
            </div>
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-2xl">{items.length} saved lessons</CardTitle>
                <CardDescription className="text-primary-foreground/72">
                  {completedCount} completed · {items.length - completedCount} in progress or ready
                  to start
                </CardDescription>
              </CardHeader>
            </Card>
          </section>

          {items.length > 0 ? (
            <section className="grid gap-5">
              {items.map((item) => {
                const post = item.post
                const percent = progressPercent(item)
                return (
                  <Card key={item.watchlist.id} className="overflow-hidden">
                    <div className="grid gap-0 md:grid-cols-[260px_minmax(0,1fr)]">
                      {post.thumbnail?.url ? (
                        <Link route="lessons.show" routeParams={{ slug: post.slug }}>
                          <img
                            src={post.thumbnail.url}
                            alt={post.thumbnail.altText || post.title}
                            className="h-full min-h-48 w-full object-cover"
                          />
                        </Link>
                      ) : (
                        <Link
                          route="lessons.show"
                          routeParams={{ slug: post.slug }}
                          className="flex min-h-48 items-center justify-center bg-muted text-muted-foreground"
                        >
                          <BookmarkCheck className="size-10" />
                        </Link>
                      )}
                      <CardContent className="flex flex-col gap-5 p-5">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          {post.publishedAtDisplay ? <span>{post.publishedAtDisplay}</span> : null}
                          {post.hasVideo || post.videoUrl ? (
                            <span className="inline-flex items-center gap-1">
                              <PlayCircle className="size-3.5" />
                              Video lesson
                            </span>
                          ) : (
                            <span>Article lesson</span>
                          )}
                          {post.watchMinutes || post.readMinutesDisplay ? (
                            <span className="inline-flex items-center gap-1">
                              <Clock3 className="size-3.5" />
                              {post.watchMinutes || `${post.readMinutesDisplay} min read`}
                            </span>
                          ) : null}
                        </div>

                        <div className="space-y-2">
                          <CardTitle className="text-2xl leading-tight">
                            <Link
                              route="lessons.show"
                              routeParams={{ slug: post.slug }}
                              className="transition-colors hover:text-primary"
                            >
                              {post.title}
                            </Link>
                          </CardTitle>
                          <CardDescription>{excerpt(post)}</CardDescription>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {(post.taxonomies ?? []).slice(0, 3).map((topic) => (
                            <Badge key={topic.id} variant="secondary" className="text-xs">
                              {topic.name}
                            </Badge>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                            <span>{item.progress?.isCompleted ? 'Completed' : 'Progress'}</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <Link
                            route="lessons.show"
                            routeParams={{ slug: post.slug }}
                            className={buttonVariants({ size: 'sm' })}
                          >
                            Continue lesson
                          </Link>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => removeLesson(post.slug)}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                )
              })}
            </section>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center gap-4 px-6 py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <BookmarkCheck className="size-7" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight">Your watchlist is empty</h2>
                  <p className="max-w-md text-sm text-muted-foreground">
                    Save lessons from the catalog or lesson pages and they will appear here as your
                    personal learning queue.
                  </p>
                </div>
                <Link route="lessons.index" className={buttonVariants()}>
                  Browse lessons
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

WatchlistIndex.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
