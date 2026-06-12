export const AccessLevels = {
  FREE: 'Free',
  MEMBER: 'Member',
  ONE_TIME_PURCHASE: 'One-Time Purchase',
  SUBSCRIPTION: 'Subscription',
  INTERNAL: 'Internal',
}

export type AccessLevelType = (typeof AccessLevels)[keyof typeof AccessLevels]
