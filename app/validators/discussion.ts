import vine from '@vinejs/vine'

export const discussionSearchValidator = vine.compile(
  vine.object({
    page: vine.number().optional(),
    limit: vine.number().optional(),
    q: vine.string().trim().optional(),
    feed: vine.enum(['none', 'popular', 'noreplies', 'unsolved', 'solved']).optional(),
    topics: vine.array(vine.string()).optional(),
    taxonomyId: vine.string().trim().optional(),
    solved: vine.string().optional(),
  })
)

export const createDiscussionValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(4).maxLength(100),
    body: vine.string().trim().minLength(4),
    taxonomyId: vine.string().optional(),
  })
)

export const updateDiscussionValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(4).maxLength(100),
    slug: vine
      .string()
      .trim()
      .maxLength(200)
      .unique(async (db, value, field) => {
        const meta = field.meta
        const query = db.from('discussions').where('slug', value)
        if (meta?.id) query.whereNot('id', meta.id)
        const exists = await query.first()
        return !exists
      }),
    body: vine.string().trim().minLength(4),
    taxonomyId: vine.string().optional(),
  })
)
