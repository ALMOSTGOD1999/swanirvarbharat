import vine from '@vinejs/vine'

export const roleIndexValidator = vine.compile(
  vine.object({
    page: vine.number().min(1).optional(),
    limit: vine.number().min(1).max(100).optional(),
    q: vine.string().optional(),
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
)

export const createRoleValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .minLength(3)
      .maxLength(50)
      .unique(async (db, value) => {
        const result = await db.from('roles').select('id').whereILike('name', value).first()
        return !result
      }),
    description: vine.string().maxLength(255).optional(),
  })
)

export const updateRoleValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .minLength(3)
      .maxLength(50)
      .unique(async (db, value, field) => {
        const result = await db
          .from('roles')
          .select('id')
          .whereILike('name', value)
          .if(field.data.params.id, (query) => query.whereNot('id', field.data.params.id))
          .first()
        return !result
      }),
    description: vine.string().maxLength(255).optional(),
  })
)
