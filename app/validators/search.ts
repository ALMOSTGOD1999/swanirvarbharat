import vine from '@vinejs/vine'

export const searchValidator = vine.compile(
  vine.object({
    q: vine.string().trim().minLength(1).maxLength(255).optional(),
    type: vine.enum(['posts', 'series', 'topics', 'discussions'] as const).optional(),
  })
)
