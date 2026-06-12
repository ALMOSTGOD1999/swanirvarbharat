import { Link } from '@adonisjs/inertia/react'
import type { Data } from '@generated/data'
import { router } from '@inertiajs/react'
import { XIcon } from 'lucide-react'
import React from 'react'

import { urlFor } from '~/client'
import ScrollReveal from '~/components/scroll_reveal'
import { SEOHead } from '~/components/seo_head'
import { Button, buttonVariants } from '~/components/ui/button'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '~/components/ui/card'
import { CheckboxFilter, type CheckboxOption } from '~/components/ui/checkbox-filter'
import DefaultLayout from '~/layouts/default'
import type { InertiaProps } from '~/types'

type PageProps = InertiaProps<{
  posts: Data.Post[]
  topics: Data.Taxonomy[]
  selectedTopicSlugs: string[]
  sortBy: string
  sortOrder: 'asc' | 'desc'
}>

type BlogIndexParams = {
  topics?: string[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

type BlogIndexVisitParams = Record<string, string | string[]>

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

export default function BlogsIndex({
  posts,
  topics,
  selectedTopicSlugs,
  sortBy,
  sortOrder,
}: PageProps) {
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>(selectedTopicSlugs)
  const topicOptions: CheckboxOption<string>[] = topics.map((topic) => ({
    label: topic.name,
    value: topic.slug,
    counts: topic.postsCount ?? 0,
  }))
  const isFiltered = selectedTopics.length > 0
  const isDefaultSort = sortBy === 'publishedAt' && sortOrder === 'desc'
  const activeSortLabel =
    sortBy === 'title' ? 'Title A-Z' : sortOrder === 'asc' ? 'Oldest first' : 'Newest first'
  const hasActiveFilters = isFiltered || !isDefaultSort

  const buildParams = React.useCallback(
    (overrides: BlogIndexParams = {}) => {
      const params: BlogIndexParams = {
        topics: selectedTopics.length > 0 ? selectedTopics : undefined,
        sortBy,
        sortOrder,
        ...overrides,
      }

      if (params.sortBy === 'publishedAt' && params.sortOrder === 'desc') {
        params.sortBy = undefined
        params.sortOrder = undefined
      }

      const nextParams: BlogIndexVisitParams = {}
      if (params.topics) nextParams.topics = params.topics
      if (params.sortBy) nextParams.sortBy = params.sortBy
      if (params.sortOrder) nextParams.sortOrder = params.sortOrder

      return nextParams
    },
    [selectedTopics, sortBy, sortOrder]
  )

  const handleSubmit = React.useCallback((params: BlogIndexVisitParams) => {
    router.get(urlFor('blogs.index'), params, {
      preserveScroll: true,
      preserveState: true,
      replace: true,
      only: ['posts', 'topics', 'selectedTopicSlugs', 'sortBy', 'sortOrder'],
    })
  }, [])

  const handleTopicChange = (next: string[]) => {
    setSelectedTopics(next)
    handleSubmit(buildParams({ topics: next.length > 0 ? next : undefined }))
  }

  const handleSort = (nextSortBy: string, nextSortOrder: 'asc' | 'desc') => {
    handleSubmit(buildParams({ sortBy: nextSortBy, sortOrder: nextSortOrder }))
  }

  const clearAll = () => {
    setSelectedTopics([])
    handleSubmit({})
  }

  return (
    <>
      <SEOHead
        title="Blog"
        description="Browse Swanirvarbharat blog posts, updates, and long-form notes from the team."
      />
      <div className="px-5 py-10">
        <div className="container mx-auto flex flex-col gap-10">
          <section className="max-w-3xl space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Blog
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Notes, updates, and deeper reads.
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Explore the latest public blog posts from Swanirvarbharat.
            </p>
          </section>

          <section className="rounded-2xl border bg-card px-3 py-3 shadow-sm sm:px-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">Browse posts</p>
                <p className="truncate text-xs text-muted-foreground sm:text-sm">
                  {posts.length} posts ·{' '}
                  {isFiltered
                    ? `${selectedTopics.length} topic${selectedTopics.length === 1 ? '' : 's'} selected`
                    : 'All topics'}{' '}
                  · {activeSortLabel}
                </p>
              </div>

              {hasActiveFilters && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={clearAll}
                  className="h-8 px-2 sm:px-3"
                >
                  Clear filters
                  <XIcon className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <CheckboxFilter
                title="Topics"
                options={topicOptions}
                value={selectedTopics}
                onChange={handleTopicChange}
                searchPlaceholder="Search topics..."
                className="h-8 border-dashed px-3 text-sm shadow-none"
              />

              <div className="inline-flex items-center gap-1 rounded-xl border bg-muted/40 p-1">
                {(
                  [
                    ['publishedAt', 'desc', 'Newest'],
                    ['publishedAt', 'asc', 'Oldest'],
                    ['title', 'asc', 'Title A-Z'],
                  ] as const
                ).map(([nextSortBy, nextSortOrder, label]) => {
                  const active = sortBy === nextSortBy && sortOrder === nextSortOrder

                  return (
                    <Button
                      key={`${nextSortBy}-${nextSortOrder}`}
                      type="button"
                      size="sm"
                      variant={active ? 'default' : 'ghost'}
                      onClick={() => handleSort(nextSortBy, nextSortOrder)}
                      className="h-7 rounded-lg px-3 text-xs sm:text-sm"
                    >
                      {label}
                    </Button>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post, i) => {
              const authorName = post.authors?.[0]?.username || 'Swanirvarbharat'

              return (
                <ScrollReveal key={post.id} delay={i * 0.05}>
                  <Card className="overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md">
                    <CardHeader className="gap-3 border-b">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {post.publishedAtDisplay ? <span>{post.publishedAtDisplay}</span> : null}
                        {post.readMinutesDisplay ? (
                          <span>· {post.readMinutesDisplay} min read</span>
                        ) : null}
                      </div>

                      <CardTitle className="text-xl leading-tight">
                        <Link
                          route="blogs.show"
                          routeParams={{ slug: post.slug }}
                          className="transition-colors hover:text-primary"
                        >
                          {post.title}
                        </Link>
                      </CardTitle>

                      <CardDescription>{excerpt(post)}</CardDescription>
                    </CardHeader>

                    <CardPanel className="flex items-center justify-between gap-3 pt-4">
                      <span className="text-sm text-muted-foreground">{authorName}</span>
                      <Link
                        route="blogs.show"
                        routeParams={{ slug: post.slug }}
                        className={buttonVariants({ size: 'sm', variant: 'outline' })}
                      >
                        Read post
                      </Link>
                    </CardPanel>
                  </Card>
                </ScrollReveal>
              )
            })}
          </section>

          <div className="flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Showing {posts.length} posts</p>
            <p className="text-sm text-muted-foreground">
              {isFiltered ? 'Filtered by topic' : 'No topic filter'} ·{' '}
              {sortBy === 'title'
                ? 'Title A-Z'
                : sortOrder === 'asc'
                  ? 'Oldest first'
                  : 'Newest first'}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

BlogsIndex.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
