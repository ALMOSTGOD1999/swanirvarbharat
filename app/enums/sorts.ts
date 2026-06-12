export const Sorts = {
  LATEST: 'latest',
  LATEST_UPDATED: 'latest_updated',
  ALPHA: 'alphabetical',
  POPULAR: 'popular',
  LONGEST: 'longest',
  SHORTEST: 'shortest',
}

export type Sorts = (typeof Sorts)[keyof typeof Sorts]
