import { router } from '@inertiajs/react'
import { BookOpenIcon, FileTextIcon, LayersIcon, MessageSquareIcon, SearchIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import DefaultLayout from '~/layouts/default'
import ScrollReveal from '~/components/scroll_reveal'
import { SEOHead } from '~/components/seo_head'
import { cn } from '~/lib/utils'
import type { InertiaProps } from '~/types'
import { Link } from '@adonisjs/inertia/react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SearchType = 'posts' | 'series' | 'topics' | 'discussions'

type SearchPageProps = InertiaProps<{
  q: string
  type: SearchType
  results: {
    data: any[]
    metadata: {
      currentPage: number
      lastPage: number
      perPage: number
      total: number
    }
  }
  counts: {
    posts: number
    series: number
    topics: number
    discussions: number
  }
}>

// ---------------------------------------------------------------------------
// Tab config
// ---------------------------------------------------------------------------

const tabs: { key: SearchType; label: string; icon: React.ReactNode }[] = [
  { key: 'posts', label: 'Posts', icon: <FileTextIcon className="size-4" /> },
  { key: 'series', label: 'Series', icon: <LayersIcon className="size-4" /> },
  { key: 'topics', label: 'Topics', icon: <BookOpenIcon className="size-4" /> },
  { key: 'discussions', label: 'Discussions', icon: <MessageSquareIcon className="size-4" /> },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Search({ q, type, results, counts }: SearchPageProps) {
  const [inputValue, setInputValue] = useState(q)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSearch = useCallback(
    (value: string, searchType?: SearchType, page?: number) => {
      const query = value.trim()
      if (!query) return

      router.get(
        '/search',
        {
          q: query,
          type: searchType ?? type,
          page: page ?? 1,
        },
        {
          preserveState: true,
          replace: true,
          preserveScroll: true,
        }
      )
    },
    [type]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setInputValue(value)

      if (debounceRef.current) clearTimeout(debounceRef.current)

      debounceRef.current = setTimeout(() => {
        handleSearch(value)
      }, 300)
    },
    [handleSearch]
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (debounceRef.current) clearTimeout(debounceRef.current)
      handleSearch(inputValue)
    },
    [inputValue, handleSearch]
  )

  const handleTabClick = useCallback(
    (tabType: SearchType) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      handleSearch(q || inputValue, tabType)
    },
    [q, inputValue, handleSearch]
  )

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      handleSearch(q || inputValue, type, newPage)
    },
    [q, inputValue, type, handleSearch]
  )

  const { metadata } = results
  const hasResults = results.data.length > 0
  const hasSearched = !!(q || inputValue.trim())

  return (
    <>
      <SEOHead
        title="Search"
        description="Search posts, series, topics, and discussions on Swanirvarbharat"
        noindex
      />

      <main className="container mx-auto px-4 py-8">
        {/* ── Search Input ─────────────────────────────────────── */}
        <ScrollReveal>
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef as any}
                type="search"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Search posts, series, topics, discussions..."
                className="h-12 pl-10 pr-4 text-base"
                size="lg"
                aria-label="search"
              />
            </div>
          </form>
        </ScrollReveal>

        {/* ── Tabs ─────────────────────────────────────────────── */}
        {hasSearched && (
          <ScrollReveal>
            <div className="mb-6 flex flex-wrap gap-2 border-b pb-4">
              {tabs.map((tab) => {
                const isActive = type === tab.key
                const count = counts[tab.key] ?? 0
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleTabClick(tab.key)}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    {tab.icon}
                    {tab.label}
                    <Badge variant={isActive ? 'secondary' : 'outline'} className="ml-1 text-xs">
                      {count}
                    </Badge>
                  </button>
                )
              })}
            </div>
          </ScrollReveal>
        )}

        {/* ── Results ──────────────────────────────────────────── */}
        {hasSearched && (
          <>
            {!hasResults ? (
              <ScrollReveal>
                <div className="py-16 text-center">
                  <SearchIcon className="mx-auto mb-4 size-12 text-muted-foreground/50" />
                  <h2 className="text-xl font-semibold text-foreground">
                    No results found for &quot;{q}&quot;
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Try different keywords or check your spelling.
                  </p>
                </div>
              </ScrollReveal>
            ) : (
              <>
                <p className="mb-4 text-sm text-muted-foreground">
                  {metadata.total} result{metadata.total !== 1 ? 's' : ''} found
                  {metadata.lastPage > 1 &&
                    ` (page ${metadata.currentPage} of ${metadata.lastPage})`}
                </p>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results.data.map((item: any) => {
                    switch (type) {
                      case 'posts':
                        return <PostCard key={item.id} post={item} />
                      case 'series':
                        return <SeriesCard key={item.id} series={item} />
                      case 'topics':
                        return <TopicCard key={item.id} topic={item} />
                      case 'discussions':
                        return <DiscussionCard key={item.id} discussion={item} />
                      default:
                        return null
                    }
                  })}
                </div>

                {/* ── Pagination ─────────────────────────────────── */}
                {metadata.lastPage > 1 && (
                  <ScrollReveal>
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(metadata.currentPage - 1)}
                        disabled={metadata.currentPage <= 1}
                      >
                        Previous
                      </Button>

                      {Array.from({ length: metadata.lastPage }, (_, i) => i + 1)
                        .filter((p) => {
                          if (metadata.lastPage <= 7) return true
                          if (p === 1 || p === metadata.lastPage) return true
                          return Math.abs(p - metadata.currentPage) <= 1
                        })
                        .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                          if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                            acc.push('ellipsis')
                          }
                          acc.push(p)
                          return acc
                        }, [])
                        .map((item, idx) =>
                          item === 'ellipsis' ? (
                            <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
                              …
                            </span>
                          ) : (
                            <Button
                              key={item}
                              variant={item === metadata.currentPage ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handlePageChange(item)}
                              className="min-w-9"
                            >
                              {item}
                            </Button>
                          )
                        )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(metadata.currentPage + 1)}
                        disabled={metadata.currentPage >= metadata.lastPage}
                      >
                        Next
                      </Button>
                    </div>
                  </ScrollReveal>
                )}
              </>
            )}
          </>
        )}

        {/* ── Initial state (no search yet) ────────────────────── */}
        {!hasSearched && (
          <ScrollReveal>
            <div className="py-16 text-center">
              <SearchIcon className="mx-auto mb-4 size-12 text-muted-foreground/50" />
              <h2 className="text-xl font-semibold text-foreground">Search Swanirvarbharat</h2>
              <p className="mt-2 text-muted-foreground">
                Find posts, series, topics, and discussions.
              </p>
            </div>
          </ScrollReveal>
        )}
      </main>
    </>
  )
}

// ---------------------------------------------------------------------------
// Result Cards
// ---------------------------------------------------------------------------

function PostCard({ post }: { post: any }) {
  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <Link href={`/posts/${post.slug}`} className="block h-full">
        {post.thumbnail?.url ? (
          <div className="border-b bg-muted/30">
            <img
              src={post.thumbnail.url}
              alt={post.thumbnail.altText || post.title}
              className="aspect-video w-full object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center border-b bg-muted/30 text-muted-foreground">
            <FileTextIcon className="size-8" />
          </div>
        )}
        <CardHeader>
          <div className="mb-2 flex items-center gap-2">
            {post.postType && <Badge variant="outline">{post.postType}</Badge>}
            {post.publishedAtDisplay && (
              <span className="text-xs text-muted-foreground">{post.publishedAtDisplay}</span>
            )}
          </div>
          <CardTitle className="line-clamp-2 text-base">{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {post.description
              ?.replace(/<[^>]*>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim() || 'Read the full post to explore the details.'}
          </p>
        </CardContent>
      </Link>
    </Card>
  )
}

function SeriesCard({ series }: { series: any }) {
  return (
    <Card className="h-full transition-all hover:shadow-md">
      <Link href={`/series/${series.slug}`} className="block h-full">
        <CardHeader>
          <CardTitle className="line-clamp-2 text-base">{series.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {series.description || 'A structured learning series'}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="gap-1">
              <BookOpenIcon className="size-3" />
              {series.postsCount ?? series.lessonCount ?? 0} lessons
            </Badge>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

function TopicCard({ topic }: { topic: any }) {
  return (
    <Card className="transition-all hover:shadow-md">
      <Link href={`/topics/${topic.slug}`} className="block">
        <CardHeader>
          <CardTitle className="text-base">{topic.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="gap-1">
            <FileTextIcon className="size-3" />
            {topic.postsCount ?? 0} posts
          </Badge>
        </CardContent>
      </Link>
    </Card>
  )
}

function DiscussionCard({ discussion }: { discussion: any }) {
  return (
    <Card className="h-full transition-all hover:shadow-md">
      <Link href={`/forum/${discussion.slug ?? discussion.id}`} className="block h-full">
        <CardHeader>
          <CardTitle className="line-clamp-2 text-base">{discussion.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {discussion.user && (
              <span className="font-medium text-foreground">
                {discussion.user.name ?? discussion.user.username}
              </span>
            )}
            {discussion.commentsCount != null && (
              <Badge variant="outline" className="gap-1">
                <MessageSquareIcon className="size-3" />
                {discussion.commentsCount}
              </Badge>
            )}
            {discussion.taxonomies?.length > 0 &&
              discussion.taxonomies.slice(0, 2).map((t: any) => (
                <Badge key={t.id} variant="secondary">
                  {t.name}
                </Badge>
              ))}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

Search.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
