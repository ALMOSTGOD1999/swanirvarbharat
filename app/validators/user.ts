import vine from '@vinejs/vine'

/**
 * Shared rules for email and password.
 */
const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)
/**
 * Username with unique check (for profile updates)
 */
const username = () =>
  vine
    .string()
    .minLength(3)
    .maxLength(50)
    .regex(/^[a-zA-Z0-9-_.]+$/)
    .notIn([
      'admin',
      'super',
      'power',
      'swanirvarbharat',
      'Swanirvarbharat',
      'jagr',
      'jagrco',
      '_jagr',
      '_jagrco',
      'jagr_',
      'jagrco_',
      'jagr-co',
      'moderator',
      'public',
      'dev',
      'alpha',
      'mail',
    ])
    .unique({ table: 'users', column: 'username', caseInsensitive: true })

/**
 * Username without unique check (for signup — uniqueness handled in controller)
 */
const signupUsername = () =>
  vine
    .string()
    .minLength(3)
    .maxLength(50)
    .regex(/^[a-zA-Z0-9-_.]+$/)
    .notIn([
      'admin',
      'super',
      'power',
      'swanirvarbharat',
      'Swanirvarbharat',
      'jagr',
      'jagrco',
      '_jagr',
      '_jagrco',
      'jagr_',
      'jagrco_',
      'jagr-co',
      'moderator',
      'public',
      'dev',
      'alpha',
      'mail',
    ])

/**
 * Validator to use when performing self-signup
 */
export const signupValidator = vine.create({
  username: signupUsername(),
  email: email(),
  password: password().confirmed({
    confirmationField: 'passwordConfirmation',
  }),
})

export const loginValidator = vine.create({
  uid: vine.string(),
  password: password(),
})

export const forgetPasswordValidator = vine.create({
  email: email(),
})

export const resetPasswordValidator = vine.create({
  token: vine.string(),
  email: email().exists({ table: 'users', column: 'email', caseInsensitive: true }),
  password: password().confirmed({
    confirmationField: 'passwordConfirmation',
  }),
})

export const userIndexValidator = vine.compile(
  vine.object({
    page: vine.number().min(1).optional(),
    limit: vine.number().min(1).max(100).optional(),
    q: vine.string().optional(),
    roleIds: vine.array(vine.string().trim().maxLength(24)).optional(),
    emailVerified: vine.boolean().optional(),
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

export const userRoleValidator = vine.compile(
  vine.object({
    roleId: vine.string().trim().maxLength(24),
  })
)

export const updateUsernameValidator = vine.compile(
  vine.object({
    username: username(),
  })
)

export const updateEmailValidator = vine.compile(
  vine.object({
    email: email().unique({ table: 'users', column: 'email' }),
    password: vine.string(),
  })
)

export const updatePasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string(),
    password: password().confirmed({
      confirmationField: 'passwordConfirmation',
    }),
  })
)
