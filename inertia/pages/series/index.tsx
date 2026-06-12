import { Link } from '@adonisjs/inertia/react'
import type React from 'react'

import { SEOHead } from '~/components/seo_head'
import ScrollReveal from '~/components/scroll_reveal'
import { Badge } from '~/components/ui/badge'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '~/components/ui/card'
import DefaultLayout from '~/layouts/default'
import type { InertiaProps } from '~/types'

import { BookOpen, Clock, FileVideo } from 'lucide-react'

type SeriesItem = {
  id: string
  name: string
  slug: string
  description?: string | null
  postsCount?: number
  videoSecondsSum?: number
}

type PageProps = InertiaProps<{
  series: SeriesItem[]
}>

function formatDuration(seconds?: number): string {
  if (!seconds || seconds === 0) return '0m'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export default function SeriesIndex({ series = [] }: PageProps) {
  return (
    <>
      <SEOHead
        title="Series"
        description="Browse our curated learning series and master new skills step by step."
      />
      <div className="px-5 py-10">
        <div className="container mx-auto flex flex-col gap-10">
          <section className="flex flex-col gap-5">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Series
              </p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Learning Series</h1>
              <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                Explore structured learning paths designed to take you from fundamentals to mastery,
                one lesson at a time.
              </p>
            </div>
          </section>

          <section>
            {series.length === 0 ? (
              <ScrollReveal>
                <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-16 text-center">
                  <BookOpen className="size-12 text-muted-foreground/50" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">No series yet</h3>
                    <p className="text-sm text-muted-foreground">
                      We are still preparing learning series. Check back soon!
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {series.map((item, index) => (
                  <ScrollReveal key={item.id} delay={index * 0.08}>
                    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
                      <CardHeader className="flex-1 gap-3">
                        <CardTitle className="text-lg leading-tight">
                          <Link
                            href={`/series/${item.slug}`}
                            className="transition-colors hover:text-primary"
                          >
                            {item.name}
                          </Link>
                        </CardTitle>

                        {item.description ? (
                          <CardDescription className="line-clamp-2">
                            {item.description}
                          </CardDescription>
                        ) : null}
                      </CardHeader>

                      <CardPanel className="pt-0">
                        <div className="flex flex-wrap items-center gap-2 border-t pt-4 text-sm text-muted-foreground">
                          <Badge variant="secondary" className="gap-1">
                            <FileVideo className="size-3.5" />
                            {item.postsCount ?? 0} {item.postsCount === 1 ? 'lesson' : 'lessons'}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <Clock className="size-3.5" />
                            {formatDuration(item.videoSecondsSum)}
                          </Badge>
                        </div>
                      </CardPanel>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  )
}

SeriesIndex.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
