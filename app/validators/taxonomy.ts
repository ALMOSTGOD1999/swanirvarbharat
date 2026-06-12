import vine from '@vinejs/vine'
import { TaxonomyTypes } from '#enums/taxonomy'
import { baseFilter } from '#validators/common'

const name = () => vine.string().trim().minLength(2).maxLength(50)
const slug = () =>
  vine
    .string()
    .trim()
    .maxLength(100)
    .unique(async (db, value, field) => {
      const result = await db
        .from('taxonomies')
        .select('id')
        .whereILike('slug', value)
        .if(field.meta.id, (query) => query.whereNot('id', field.meta.id))
        .first()
      return !result
    })
const description = () => vine.string().trim().maxLength(255)
const pageTitle = () => vine.string().trim().maxLength(100)
const metaDescription = () => vine.string().trim().maxLength(255)

export const createTaxonomyValidator = vine.create({
  name: name(),
  slug: slug().optional(),
  description: description().optional().nullable(),
  pageTitle: pageTitle().optional().nullable(),
  metaDescription: metaDescription().optional().nullable(),
  parentId: vine.string().trim().maxLength(24).optional().nullable(),
  isFeatured: vine.boolean().optional(),
  type: vine.enum(Object.values(TaxonomyTypes)).optional(),
  thumbnail: vine
    .object({
      file: vine
        .file({ extnames: ['jpg', 'png', 'jpeg', 'webp', 'apng'] })
        .optional()
        .nullable(),
      assetId: vine.string().optional(),
      altText: vine.string().maxLength(255).optional(),
      credit: vine.string().maxLength(255).optional(),
    })
    .optional(),
})

export const updateTaxonomyValidator = vine.create({
  name: name().optional(),
  slug: slug().optional(),
  description: description().optional().nullable(),
  pageTitle: pageTitle().optional().nullable(),
  metaDescription: metaDescription().optional().nullable(),
  parentId: vine.string().trim().maxLength(24).optional().nullable(),
  isFeatured: vine.boolean().optional(),
  type: vine.enum(Object.values(TaxonomyTypes)).optional(),
  thumbnail: vine
    .object({
      file: vine
        .any()
        .transform((value) => {
          if (value === 'null') return 'remove'
          if (value && typeof value === 'object' && 'size' in value) return value
          return undefined
        })
        .optional(),
      assetId: vine.string().optional(),
      altText: vine.string().maxLength(255).optional(),
      credit: vine.string().maxLength(255).optional(),
    })
    .optional(),
})

export const listTaxonomyValidator = vine.create({
  ...baseFilter.getProperties(),
  types: vine.array(vine.enum(Object.values(TaxonomyTypes))).optional(),
  isFeatured: vine.boolean().optional(),
  ownerIds: vine.array(vine.string().trim().maxLength(24)).optional(),
  dateFrom: vine
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  dateTo: vine
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  sortBy: vine.string().optional(),
  sortOrder: vine.enum(['asc', 'desc']).optional(),
})

export const taxonomyContentValidator = vine.compile(
  vine.object({
    postIds: vine.array(vine.string().trim().maxLength(24)),
  })
)
