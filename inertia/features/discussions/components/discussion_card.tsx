import { ArrowBigUp, Check, MessageSquare } from 'lucide-react'
import { Link } from '@adonisjs/inertia/react'
import { Badge } from '~/components/ui/badge'
import type { Data } from '@generated/data'

type DiscussionCardProps = {
  discussion: Data.Discussion
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

export default function DiscussionCard({ discussion }: DiscussionCardProps) {
  const isSolved = !!discussion.solvedAt

  return (
    <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
      <div className="flex gap-4">
        {/* Vote count */}
        <div className="flex flex-col items-center gap-1 text-muted-foreground">
          <ArrowBigUp className="size-5" />
          <span className="text-sm font-medium">{discussion.votesCount}</span>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/forum/${discussion.slug}`}
              className="text-base font-semibold leading-tight transition-colors hover:text-primary"
            >
              {discussion.title}
            </Link>
            {isSolved && (
              <Badge variant="default" className="bg-green-600 text-white shrink-0">
                <Check className="size-3 mr-1" />
                Solved
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {/* Author */}
            <div className="flex items-center gap-1.5">
              <div className="flex size-5 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {discussion.user?.username?.[0]?.toUpperCase() || '?'}
              </div>
              <span>{discussion.user?.username || 'Anonymous'}</span>
            </div>

            {/* Taxonomy */}
            {discussion.taxonomy && (
              <Badge variant="secondary" className="text-xs">
                {discussion.taxonomy.name}
              </Badge>
            )}

            {/* Comments count */}
            <span className="flex items-center gap-1">
              <MessageSquare className="size-3.5" />
              {discussion.commentsCount}
            </span>

            {/* Time */}
            <span className="ml-auto">{timeAgo(discussion.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
