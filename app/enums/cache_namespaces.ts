export const CacheNamespaces = {
  POSTS: 'POSTS',
  COLLECTIONS: 'COLLECTIONS',
  TAXONOMIES: 'TAXONOMIES',
  PLANS: 'PLANS',
  FEED: 'FEED',
  SCHEDULE: 'SCHEDULE',
  SYNDICATION: 'SYNDICATION',
}

export type CacheNamespace = (typeof CacheNamespaces)[keyof typeof CacheNamespaces]
