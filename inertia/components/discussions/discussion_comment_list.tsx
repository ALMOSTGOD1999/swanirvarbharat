import { useState } from 'react'
import type { Data } from '@generated/data'
import DiscussionCommentCard from './discussion_comment_card'

type DiscussionCommentListProps = {
  comments: Data.Comment[]
  discussionId: string
  currentUserId?: string
  parent?: Data.Comment | null
  level?: number
}

export default function DiscussionCommentList({
  comments,
  discussionId,
  currentUserId,
  parent = null,
  level = 0,
}: DiscussionCommentListProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const filtered = comments
    .filter((c) => c.replyTo === (parent?.id || null))
    .sort((a, b) => b.voteCount - a.voteCount)

  if (filtered.length === 0) return null

  return (
    <ol className={`list-none space-y-1 ${level > 0 ? 'pl-6 border-l border-border' : ''}`}>
      {filtered.map((comment) => (
        <li key={comment.id}>
          <DiscussionCommentCard
            comment={comment}
            discussionId={discussionId}
            currentUserId={currentUserId}
            onReply={(id) => setReplyingTo(id)}
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
          />
          <DiscussionCommentList
            comments={comments}
            discussionId={discussionId}
            currentUserId={currentUserId}
            parent={comment}
            level={level + 1}
          />
        </li>
      ))}
    </ol>
  )
}
