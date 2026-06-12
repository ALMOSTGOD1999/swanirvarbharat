export const DiscussionViewTypes = {
  VIEW: 1,
  IMPRESSION: 2,
} as const

export type DiscussionViewType = (typeof DiscussionViewTypes)[keyof typeof DiscussionViewTypes]
