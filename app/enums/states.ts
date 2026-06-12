export const States = {
  DRAFT: 'Draft',
  IN_REVIEW: 'In Review',
  UNLISTED: 'Unlisted',
  PRIVATE: 'Private',
  PUBLIC: 'Public',
  ARCHIVED: 'Archived',
  DECLINED: 'Declined',
  IN_PROGRESS: 'In Progress',
}

export type State = (typeof States)[keyof typeof States]
