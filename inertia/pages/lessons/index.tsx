import { Link } from '@adonisjs/inertia/react'
import type { Data } from '@generated/data'
import { router } from '@inertiajs/react'
import { Clock3, PlayCircle, XIcon } from 'lucide-react'
import React from 'react'

import { urlFor } from '~/client'
import ScrollReveal from '~/components/scroll_reveal'
import { SEOHead } from '~/components/seo_head'
import { Badge } from '~/components/ui/badge'
import { Button, buttonVariants } from '~/components/ui/button'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '~/components/ui/card'
import { CheckboxFilter, type CheckboxOption } from '~/components/ui/checkbox-filter'
import DefaultLayout from '~/layouts/default'
import type { InertiaProps } from '~/types'

type LessonPost = Data.Post & {
  hasVideo?: boolean
  watchMinutes?: string
}

type PageProps = InertiaProps<{
  lessons: LessonPost[]
  topics: Data.Taxonomy[]
  selectedTopicSlugs: string[]
  sortBy: string
  sortOrder: 'asc' | 'desc'
}>

type LessonsIndexParams = {
  topics?: string[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

type LessonsIndexVisitParams = Record<string, string | string[]>

function stripHtml(input?: string | null) {
  if (!input) return ''
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function excerpt(lesson: LessonPost) {
  const source = lesson.description || stripHtml(lesson.body)
  if (!source) return 'Open the lesson to start learning.'
  if (source.length <= 170) return source
  return `${source.slice(0, 167).trim()}…`
}

export default function LessonsIndex({
  lessons,
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
    (overrides: LessonsIndexParams = {}) => {
      const params: LessonsIndexParams = {
        topics: selectedTopics.length > 0 ? selectedTopics : undefined,
        sortBy,
        sortOrder,
        ...overrides,
      }

      if (params.sortBy === 'publishedAt' && params.sortOrder === 'desc') {
        params.sortBy = undefined
        params.sortOrder = undefined
      }

      const nextParams: LessonsIndexVisitParams = {}
      if (params.topics) nextParams.topics = params.topics
      if (params.sortBy) nextParams.sortBy = params.sortBy
      if (params.sortOrder) nextParams.sortOrder = params.sortOrder
      return nextParams
    },
    [selectedTopics, sortBy, sortOrder]
  )

  const handleSubmit = React.useCallback((params: LessonsIndexVisitParams) => {
    router.get(urlFor('lessons.index'), params, {
      preserveScroll: true,
      preserveState: true,
      replace: true,
      only: ['lessons', 'topics', 'selectedTopicSlugs', 'sortBy', 'sortOrder'],
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
        title="Lessons"
        description="Browse practical Swanirvarbharat lessons with topic filters, video lessons, and article walkthroughs."
      />
      <div className="px-5 py-10">
        <div className="container mx-auto flex flex-col gap-10">
          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Lessons
              </p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Master hospitality &amp; spoken English.
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                Explore hotel management, hospitality skills, and spoken English lessons from the
                Swanirvarbharat learning library.
              </p>
            </div>
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-2xl">{lessons.length} lessons</CardTitle>
                <CardDescription className="text-primary-foreground/72">
                  Filter by topic, then continue into a focused lesson page with progress and
                  watchlist controls.
                </CardDescription>
              </CardHeader>
            </Card>
          </section>

          <section className="rounded-2xl border bg-card px-3 py-3 shadow-sm sm:px-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">Browse lessons</p>
                <p className="truncate text-xs text-muted-foreground sm:text-sm">
                  {lessons.length} lessons ·{' '}
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
            {lessons.map((lesson, i) => (
              <ScrollReveal key={lesson.id} delay={i * 0.04}>
                <Card className="h-full overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md">
                  {lesson.thumbnail?.url ? (
                    <img
                      src={lesson.thumbnail.url}
                      alt={lesson.thumbnail.altText || lesson.title}
                      className="aspect-video w-full object-cover"
                    />
                  ) : null}
                  <CardHeader className="gap-3 border-b">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {lesson.publishedAtDisplay ? <span>{lesson.publishedAtDisplay}</span> : null}
                      {lesson.hasVideo || lesson.videoUrl ? (
                        <span className="inline-flex items-center gap-1">
                          <PlayCircle className="size-3.5" />
                          Video
                        </span>
                      ) : (
                        <span>Article</span>
                      )}
                      {lesson.watchMinutes || lesson.readMinutesDisplay ? (
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="size-3.5" />
                          {lesson.watchMinutes || `${lesson.readMinutesDisplay} min read`}
                        </span>
                      ) : null}
                    </div>
                    <CardTitle className="text-xl leading-tight">
                      <Link
                        route="lessons.show"
                        routeParams={{ slug: lesson.slug }}
                        className="transition-colors hover:text-primary"
                      >
                        {lesson.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>{excerpt(lesson)}</CardDescription>
                  </CardHeader>
                  <CardPanel className="flex items-center justify-between gap-3 pt-4">
                    <div className="flex flex-wrap gap-1.5">
                      {(lesson.taxonomies ?? []).slice(0, 2).map((topic) => (
                        <Badge key={topic.id} variant="secondary" className="text-xs">
                          {topic.name}
                        </Badge>
                      ))}
                    </div>
                    <Link
                      route="lessons.show"
                      routeParams={{ slug: lesson.slug }}
                      className={buttonVariants({ size: 'sm', variant: 'outline' })}
                    >
                      Start
                    </Link>
                  </CardPanel>
                </Card>
              </ScrollReveal>
            ))}
          </section>
        </div>
      </div>
    </>
  )
}

LessonsIndex.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
