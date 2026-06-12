import vine from '@vinejs/vine'
import { baseFilter } from '#validators/common'
import { States } from '#enums/states'

export const playlistIndexValidator = vine.create({
  ...baseFilter.getProperties(),
  states: vine.array(vine.enum(Object.values(States))).optional(),
  ownerIds: vine.array(vine.string().fixedLength(24)).optional(),
  dateFrom: vine
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  dateTo: vine
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  sortBy: vine.string().trim().optional(),
  sortOrder: vine.enum(['asc', 'desc'] as const).optional(),
})

const name = () => vine.string().trim().maxLength(255).minLength(3)
const slug = () => vine.string().trim().maxLength(255)
const description = () => vine.string().trim().maxLength(255)

export const createPlaylistValidator = vine.create({
  name: name(),
  slug: slug()
    .unique(async (db, value, field) => {
      const result = await db
        .from('playlists')
        .select('id')
        .whereILike('slug', value)
        .if(field.meta.id, (query) => query.whereNot('id', field.meta.id))
        .first()
      return !result
    })
    .optional(),
  state: vine.enum(Object.values(States)).optional(),
  isFeatured: vine.boolean().optional(),
  description: description().optional().nullable(),
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

export const updatePlaylistValidator = vine.create({
  name: name().optional(),
  slug: slug()
    .unique(async (db, value, field) => {
      const result = await db
        .from('playlists')
        .select('id')
        .whereILike('slug', value)
        .if(field.data.params.id, (query) => query.whereNot('id', field.data.params.id))
        .first()
      return !result
    })
    .optional(),
  state: vine.enum(Object.values(States)).optional(),
  isFeatured: vine.boolean().optional(),
  description: description().optional().nullable(),
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

export const playlistPostValidator = vine.create({
  postIds: vine
    .array(vine.string().fixedLength(24).exists({ table: 'posts', column: 'id' }))
    .optional(),
})

export const reorderPlaylistPostsValidator = vine.create({
  postIds: vine.array(vine.string().fixedLength(24)),
})
