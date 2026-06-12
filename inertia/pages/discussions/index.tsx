import { Link } from '@adonisjs/inertia/react'
import { router } from '@inertiajs/react'
import { Plus } from 'lucide-react'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'

import DefaultLayout from '~/layouts/default'
import { Button } from '~/components/ui/button'
import { SEOHead } from '~/components/seo_head'
import DiscussionCard from '~/features/discussions/components/discussion_card'
import DiscussionFilters from '~/features/discussions/components/discussion_filters'
import type { InertiaProps } from '~/types'
import type { Data } from '@generated/data'
import type { PaginatorMeta } from '~/hooks/use_data_table'

type FeedType = 'none' | 'popular' | 'noreplies' | 'unsolved' | 'solved'

type PageProps = InertiaProps<{
  discussions: { data: Data.Discussion[]; metadata: PaginatorMeta }
  filters: { q?: string; feed?: FeedType; topics?: string[] }
}>

function buildHref(page: number, q?: string, feed?: FeedType, topics?: string[]) {
  const params = new URLSearchParams()
  if (page > 1) params.set('page', String(page))
  if (q) params.set('q', q)
  if (feed && feed !== 'none') params.set('feed', feed)
  if (topics?.length) {
    for (const topic of topics) params.append('topics', topic)
  }
  const query = params.toString()
  return query ? `/forum?${query}` : '/forum'
}

export default function DiscussionsIndex({ discussions, filters }: PageProps) {
  const [q, setQ] = useState(filters.q || '')
  const [feed, setFeed] = useState<FeedType>(filters.feed || 'none')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(1, q, feed)
    }, 300)
    return () => clearTimeout(timer)
  }, [q])

  const navigate = useCallback((page: number, searchQ?: string, searchFeed?: FeedType) => {
    router.get(
      buildHref(page, searchQ, searchFeed),
      {},
      { preserveState: true, preserveScroll: true }
    )
  }, [])

  const handleSearch = useCallback((value: string) => {
    setQ(value)
  }, [])

  const handleFeedChange = useCallback(
    (value: FeedType) => {
      setFeed(value)
      navigate(1, q, value)
    },
    [navigate, q]
  )

  return (
    <>
      <SEOHead
        title="Forum"
        description="Join the community discussion. Ask questions, share knowledge, and learn about hotel management, hospitality, and spoken English."
      />
      <div className="px-5 py-10">
        <div className="container mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Forum
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Discussions</h1>
            </div>
            <Link href="/forum/create">
              <Button size="sm">
                <Plus className="size-4 mr-1" />
                New Discussion
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <DiscussionFilters
            q={q}
            feed={feed}
            onSearch={handleSearch}
            onFeedChange={handleFeedChange}
          />

          {/* Results info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>{discussions.metadata.total} discussions</p>
            <p>
              Page {discussions.metadata.currentPage} of {discussions.metadata.lastPage}
            </p>
          </div>

          {/* Discussion list */}
          <div className="space-y-3">
            {discussions.data.map((discussion) => (
              <DiscussionCard key={discussion.id} discussion={discussion} />
            ))}
            {discussions.data.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">No discussions found</p>
                <p className="text-sm mt-1">Be the first to start a discussion!</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {discussions.metadata.lastPage > 1 && (
            <div className="flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {discussions.data.length} of {discussions.metadata.total} discussions
              </p>
              <div className="flex items-center gap-2">
                {discussions.metadata.previousPageUrl && (
                  <Link
                    href={discussions.metadata.previousPageUrl}
                    className="rounded-md border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    Previous
                  </Link>
                )}
                {discussions.metadata.nextPageUrl && (
                  <Link
                    href={discussions.metadata.nextPageUrl}
                    className="rounded-md border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    Next
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

DiscussionsIndex.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
