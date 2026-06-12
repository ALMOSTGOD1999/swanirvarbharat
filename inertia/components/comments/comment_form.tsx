import { Form } from '~/components/ui/form'
import { Textarea } from '~/components/ui/textarea'
import { Button } from '~/components/ui/button'
import { Send } from 'lucide-react'

type CommentFormProps = {
  postId: string
  replyTo?: string
  rootParentId?: string
  existingBody?: string
  commentId?: string
  onCancel?: () => void
}

export default function CommentForm({
  postId,
  replyTo,
  rootParentId,
  existingBody,
  commentId,
  onCancel,
}: CommentFormProps) {
  const isEditing = !!commentId

  return (
    <Form
      route={isEditing ? 'comments.update' : 'comments.store'}
      routeParams={isEditing ? { id: commentId } : undefined}
      transform={(props) => ({
        ...props,
        postId,
        replyTo: replyTo || undefined,
        rootParentId: rootParentId || undefined,
      })}
    >
      {({ processing }) => (
        <div className="space-y-3">
          <Textarea
            name="body"
            defaultValue={existingBody || ''}
            placeholder={
              isEditing
                ? 'Edit your comment...'
                : replyTo
                  ? 'Write a reply...'
                  : 'Join the discussion...'
            }
            className="min-h-[80px]"
          />
          <div className="flex items-center gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" size="sm" disabled={processing}>
              <Send className="size-4" />
              {processing ? 'Sending...' : isEditing ? 'Update' : 'Share'}
            </Button>
          </div>
        </div>
      )}
    </Form>
  )
}
