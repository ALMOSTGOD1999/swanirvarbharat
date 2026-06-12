import vine from '@vinejs/vine'
import { baseFilter } from '#validators/common'

export const blogIndexValidator = vine.create({
  ...baseFilter.getProperties(),
  topic: vine.string().trim().maxLength(255).optional(),
  topics: vine.array(vine.string().trim().maxLength(255)).optional(),
  sortBy: vine.string().trim().optional(),
  sortOrder: vine.enum(['asc', 'desc'] as const).optional(),
})
