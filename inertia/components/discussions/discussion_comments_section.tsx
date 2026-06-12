import { MessageSquare } from 'lucide-react'
import type { Data } from '@generated/data'
import { Separator } from '~/components/ui/separator'
import DiscussionCommentForm from './discussion_comment_form'
import DiscussionCommentList from './discussion_comment_list'

type DiscussionCommentsSectionProps = {
  discussionId: string
  comments: Data.Comment[]
  currentUserId?: string
}

export default function DiscussionCommentsSection({
  discussionId,
  comments,
  currentUserId,
}: DiscussionCommentsSectionProps) {
  const publicComments = comments.filter((c) => c.stateId === 3 || c.stateId === 6)
  const commentCount = publicComments.length

  return (
    <div className="mt-8">
      <Separator className="mb-6" />

      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="size-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">
          Discussion
          <span className="text-muted-foreground font-normal ml-2 text-sm">
            {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
          </span>
        </h2>
      </div>

      <div className="mb-6">
        <DiscussionCommentForm discussionId={discussionId} />
      </div>

      {publicComments.length > 0 ? (
        <DiscussionCommentList
          comments={publicComments}
          discussionId={discussionId}
          currentUserId={currentUserId}
        />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare className="size-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Be the first to comment!</p>
        </div>
      )}
    </div>
  )
}
