export const TaxonomyTypes = {
  CONTENT: 'Content',
  DISCUSSION: 'Discussion',
}

export type TaxonomyType = (typeof TaxonomyTypes)[keyof typeof TaxonomyTypes]
