import { Link } from '@adonisjs/inertia/react'
import { SEOHead } from '~/components/seo_head'
import { ArrowLeft, Check, ThumbsUp } from 'lucide-react'
import React, { useRef, useEffect } from 'react'

import { Badge } from '~/components/ui/badge'
import { Button, buttonVariants } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { Separator } from '~/components/ui/separator'
import DiscussionCommentsSection from '~/components/discussions/discussion_comments_section'
import DefaultLayout from '~/layouts/default'
import type { InertiaProps } from '~/types'
import type { Data } from '@generated/data'

type PageProps = InertiaProps<{
  discussion: Data.Discussion
  currentUserId: string | null
}>

function formatDate(date: string | null): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function timeAgo(date: string | null): string {
  if (!date) return ''
  const now = new Date()
  const then = new Date(date)
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return then.toLocaleDateString()
}

export default function DiscussionsShow({ discussion, currentUserId }: PageProps) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const body = discussion.body || ''
  const isOwner = currentUserId === discussion.userId
  const isSolved = !!discussion.solvedAt

  useEffect(() => {
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
        title={discussion.title}
        description={discussion.body?.replace(/<[^>]*>/g, ' ').slice(0, 160) || undefined}
        type="article"
      />
      <div className="px-5 py-10">
        <div className="container mx-auto max-w-4xl space-y-6">
          {/* Back link */}
          <Link href="/forum" className={buttonVariants({ size: 'sm', variant: 'outline' })}>
            <ArrowLeft className="size-4 mr-1" />
            Back to forum
          </Link>

          {/* Discussion header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {discussion.taxonomy && <Badge variant="secondary">{discussion.taxonomy.name}</Badge>}
              {isSolved && (
                <Badge variant="default" className="bg-green-600 text-white">
                  <Check className="size-3 mr-1" />
                  Solved
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">
                {formatDate(discussion.createdAt)}
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {discussion.title}
            </h1>

            {/* Author info */}
            <div className="flex items-center gap-3 text-sm">
              <div className="flex size-8 items-center justify-center rounded-full bg-muted font-medium">
                {discussion.user?.username?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <span className="font-medium">{discussion.user?.username || 'Anonymous'}</span>
                <span className="text-muted-foreground ml-2">{timeAgo(discussion.createdAt)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Discussion body */}
          <article className="space-y-4 text-base leading-7">
            {body ? (
              <div ref={bodyRef} className="space-y-4" />
            ) : (
              <p className="text-muted-foreground">No content available.</p>
            )}
          </article>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Vote button */}
            <Form route="discussions.toggleVote" routeParams={{ id: discussion.id }}>
              <Button type="submit" variant="outline" size="sm">
                <ThumbsUp className="size-4 mr-1" />
                Vote ({discussion.votesCount})
              </Button>
            </Form>

            {/* Solved toggle (owner only) */}
            {isOwner && (
              <Form route="discussions.toggleSolved" routeParams={{ slug: discussion.slug }}>
                <Button type="submit" variant={isSolved ? 'outline' : 'default'} size="sm">
                  <Check className="size-4 mr-1" />
                  {isSolved ? 'Mark Unsolved' : 'Mark Solved'}
                </Button>
              </Form>
            )}

            {/* Views */}
            <span className="text-sm text-muted-foreground ml-auto">
              {discussion.views || 0} views
            </span>
          </div>

          <Separator />

          {/* Comments */}
          <DiscussionCommentsSection
            discussionId={discussion.id}
            comments={(discussion as any).comments || []}
            currentUserId={currentUserId ?? undefined}
          />
        </div>
      </div>
    </>
  )
}

DiscussionsShow.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
