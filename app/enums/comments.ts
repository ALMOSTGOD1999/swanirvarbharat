export const CommentTypeIdColumn = {
  POST: 'postId',
  LESSON_REQUEST: 'lessonRequestId',
  DISCUSSION: 'discussionId',
}

export type CommentType = (typeof CommentTypeIdColumn)[keyof typeof CommentTypeIdColumn]
