import { Link } from '@adonisjs/inertia/react'
import type { Data } from '@generated/data'
import type React from 'react'
import ScrollReveal from '~/components/scroll_reveal'
import { SEOHead } from '~/components/seo_head'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '~/components/ui/card'
import DefaultLayout from '~/layouts/default'
import { buttonVariants } from '~/components/ui/button'
import type { InertiaProps } from '~/types'

type PageProps = InertiaProps<{
  topics: Data.Taxonomy[]
}>

export default function TopicsIndex({ topics }: PageProps) {
  return (
    <>
      <SEOHead
        title="Topics"
        description="Explore topics across a wide range of subjects. Browse posts organized by category and concept."
      />
      <div className="px-5 py-10">
        <div className="container mx-auto flex flex-col gap-10">
          <section className="max-w-3xl space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Topics
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Explore public topics and the posts they collect.
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Browse the knowledge areas available in Swanirvarbharat and jump into the content
              behind each one.
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {topics.map((topic, i) => (
              <ScrollReveal key={topic.id} delay={i * 0.05}>
                <Card className="overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
                  <CardHeader className="gap-3 border-b">
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="text-xl leading-tight">
                        <Link
                          route="topics.show"
                          routeParams={{ slug: topic.slug }}
                          className="transition-colors hover:text-primary"
                        >
                          {topic.name}
                        </Link>
                      </CardTitle>
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {topic.postsCount ?? 0} posts
                      </span>
                    </div>
                    <CardDescription>
                      {topic.description || 'Open this topic to see the posts grouped under it.'}
                    </CardDescription>
                  </CardHeader>

                  <CardPanel className="flex items-center justify-between gap-3 pt-4">
                    <span className="text-sm text-muted-foreground">
                      {topic.pageTitle || topic.slug}
                    </span>
                    <Link
                      route="topics.show"
                      routeParams={{ slug: topic.slug }}
                      className={buttonVariants({ size: 'sm', variant: 'outline' })}
                    >
                      View topic
                    </Link>
                  </CardPanel>
                </Card>
              </ScrollReveal>
            ))}
          </section>

          <div className="flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Showing {topics.length} topics</p>
          </div>
        </div>
      </div>
    </>
  )
}

TopicsIndex.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
