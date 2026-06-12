import vine from '@vinejs/vine'
import { AssetTypes } from '#enums/asset'
import { baseFilter } from '#validators/common'

export const assetIndexValidator = vine.create({
  ...baseFilter.getProperties(),
  types: vine.array(vine.enum(Object.values(AssetTypes))).optional(),
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
