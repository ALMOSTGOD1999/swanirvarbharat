import vine from '@vinejs/vine'

export const baseFilter = vine.object({
  page: vine.number().optional(),
  limit: vine.number().optional(),
  q: vine.string().optional(),
})

export const imageFile = vine.object({
  file: vine
    .file({ extnames: ['jpg', 'png', 'jpeg', 'webp', 'apng'] })
    .optional()
    .nullable(),
  assetId: vine.string().optional(),
  altText: vine.string().maxLength(255).optional(),
  credit: vine.string().maxLength(255).optional(),
})

export const imageFileWithRemove = vine.object({
  file: vine
    .any()
    .transform((value) => {
      // "null" string from hidden input means remove the existing image
      if (value === 'null') return 'remove'
      // real file object passes through
      if (value && typeof value === 'object' && 'size' in value) return value
      // undefined/empty means keep existing
      return undefined
    })
    .optional(),
  assetId: vine.string().optional(),
  altText: vine.string().maxLength(255).optional(),
  credit: vine.string().maxLength(255).optional(),
})
