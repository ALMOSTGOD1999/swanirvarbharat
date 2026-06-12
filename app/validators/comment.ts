import vine from '@vinejs/vine'

export const commentStoreValidator = vine.compile(
  vine.object({
    postId: vine.string().trim().optional(),
    discussionId: vine.string().trim().optional(),
    body: vine.string().trim().minLength(1),
    replyTo: vine.string().trim().optional(),
    rootParentId: vine.string().trim().optional(),
  })
)

export const commentUpdateValidator = vine.compile(
  vine.object({
    body: vine.string().trim().minLength(1),
  })
)

export const commentIndexValidator = vine.compile(
  vine.object({
    page: vine.number().optional(),
    limit: vine.number().optional(),
    q: vine.string().trim().optional(),
    postId: vine.string().trim().optional(),
  })
)
