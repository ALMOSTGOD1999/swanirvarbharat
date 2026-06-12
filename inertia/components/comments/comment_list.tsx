import { useState } from 'react'
import type { Data } from '@generated/data'
import CommentCard from './comment_card'

type CommentListProps = {
  comments: Data.Comment[]
  postId: string
  currentUserId?: string
  parent?: Data.Comment | null
  level?: number
}

export default function CommentList({
  comments,
  postId,
  currentUserId,
  parent = null,
  level = 0,
}: CommentListProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const filtered = comments
    .filter((c) => c.replyTo === (parent?.id || null))
    .sort((a, b) => b.voteCount - a.voteCount)

  if (filtered.length === 0) return null

  return (
    <ol className={`list-none space-y-1 ${level > 0 ? 'pl-6 border-l border-border' : ''}`}>
      {filtered.map((comment) => (
        <li key={comment.id}>
          <CommentCard
            comment={comment}
            postId={postId}
            currentUserId={currentUserId}
            onReply={(id) => setReplyingTo(id)}
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
          />
          <CommentList
            comments={comments}
            postId={postId}
            currentUserId={currentUserId}
            parent={comment}
            level={level + 1}
          />
        </li>
      ))}
    </ol>
  )
}
