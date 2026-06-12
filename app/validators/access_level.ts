import vine from '@vinejs/vine'

export const accessLevelIndexValidator = vine.create({})

export const createAccessLevelValidator = vine.create({
  name: vine.string().trim().maxLength(50).minLength(1),
  color: vine
    .string()
    .trim()
    .maxLength(10)
    .regex(/^#[0-9a-fA-F]{6}$/),
  sortOrder: vine.number().min(0).optional(),
  isDefault: vine.boolean().optional(),
})

export const updateAccessLevelValidator = vine.create({
  name: vine.string().trim().maxLength(50).minLength(1).optional(),
  color: vine
    .string()
    .trim()
    .maxLength(10)
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  sortOrder: vine.number().min(0).optional(),
  isDefault: vine.boolean().optional(),
})

export const reorderAccessLevelsValidator = vine.create({
  accessLevelIds: vine.array(vine.string().fixedLength(24)),
})
