export const CommentStateIds = {
  PENDING: 1,
  IN_REVIEW: 2,
  PUBLIC: 3,
  DECLINED: 4,
  SPAM: 5,
  ARCHIVED: 6,
} as const

export type CommentStateId = (typeof CommentStateIds)[keyof typeof CommentStateIds]
