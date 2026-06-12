import { usePage } from '@inertiajs/react'
import { ArrowBigUp, MessageSquare, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Form } from '~/components/ui/form'
import type { Data } from '@generated/data'
import DiscussionCommentForm from './discussion_comment_form'

type DiscussionCommentCardProps = {
  comment: Data.Comment
  discussionId: string
  currentUserId?: string
  onReply?: (commentId: string) => void
  replyingTo?: string | null
  onCancelReply?: () => void
}

export default function DiscussionCommentCard({
  comment,
  discussionId,
  onReply,
  replyingTo,
  onCancelReply,
}: DiscussionCommentCardProps) {
  const [editing, setEditing] = useState(false)
  const { auth } = usePage<{ auth: { user?: Data.User } }>().props
  const user = auth?.user

  const hasVoted = user ? comment.userVotes.includes(user.id) : false
  const isOwner = user?.id === comment.userId

  const displayName = comment.user?.username || 'Anonymous'

  return (
    <div className="py-4" id={`comment${comment.id}`}>
      {comment.replyTo && (
        <div className="text-xs text-muted-foreground mb-2 pl-8">Replying to a comment</div>
      )}

      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="size-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
            {comment.user ? comment.user.username?.[0]?.toUpperCase() || '?' : '?'}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">
              {comment.user ? (
                <a href={`/${comment.user.username}`} className="hover:underline">
                  {displayName}
                </a>
              ) : (
                displayName
              )}
            </span>
            <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
          </div>

          {editing ? (
            <DiscussionCommentForm
              discussionId={discussionId}
              commentId={comment.id}
              existingBody={comment.body ?? undefined}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{comment.body}</div>
          )}

          <div className="flex items-center gap-3 mt-2">
            <Form route="comments.toggleVote" routeParams={{ id: comment.id }}>
              <button
                type="submit"
                className={`flex items-center gap-1 text-xs transition-colors ${
                  hasVoted
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <ArrowBigUp className="size-4" />
                {comment.voteCount > 0 && comment.voteCount}
              </button>
            </Form>

            {user && (
              <button
                type="button"
                onClick={() => onReply?.(comment.id)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageSquare className="size-3.5" />
                Reply
              </button>
            )}

            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </button>
                <Form route="comments.destroy" routeParams={{ id: comment.id }}>
                  <button
                    type="submit"
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </button>
                </Form>
              </>
            )}
          </div>

          {replyingTo === comment.id && (
            <div className="mt-3">
              <DiscussionCommentForm
                discussionId={discussionId}
                replyTo={comment.id}
                rootParentId={comment.rootParentId || comment.id}
                onCancel={onCancelReply}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
