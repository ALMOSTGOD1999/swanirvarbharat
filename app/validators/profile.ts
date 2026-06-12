import vine from '@vinejs/vine'

export const profileUpdateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(75).optional().nullable(),
    biography: vine.string().trim().optional().nullable(),
    location: vine.string().trim().maxLength(255).optional().nullable(),
    website: vine.string().trim().url().normalizeUrl().maxLength(255).optional().nullable(),
    company: vine.string().trim().maxLength(255).optional().nullable(),
    twitterUrl: vine
      .string()
      .trim()
      .url({ host_whitelist: ['twitter.com', 'x.com'] })
      .normalizeUrl()
      .maxLength(255)
      .optional()
      .nullable(),
    githubUrl: vine
      .string()
      .trim()
      .url({ host_whitelist: ['github.com'] })
      .normalizeUrl()
      .maxLength(255)
      .optional()
      .nullable(),
    youtubeUrl: vine
      .string()
      .trim()
      .url({ host_whitelist: ['youtube.com'] })
      .normalizeUrl()
      .maxLength(255)
      .optional()
      .nullable(),
    facebookUrl: vine
      .string()
      .trim()
      .url({ host_whitelist: ['facebook.com'] })
      .normalizeUrl()
      .maxLength(255)
      .optional()
      .nullable(),
    instagramUrl: vine
      .string()
      .trim()
      .url({ host_whitelist: ['instagram.com'] })
      .normalizeUrl()
      .maxLength(255)
      .optional()
      .nullable(),
    linkedinUrl: vine
      .string()
      .trim()
      .url({ host_whitelist: ['linkedin.com'] })
      .normalizeUrl()
      .maxLength(255)
      .optional()
      .nullable(),
    blueskyUrl: vine
      .string()
      .trim()
      .url({ host_whitelist: ['bsky.app'] })
      .normalizeUrl()
      .maxLength(255)
      .optional()
      .nullable(),
    threadsUrl: vine
      .string()
      .trim()
      .url({ host_whitelist: ['threads.net'] })
      .normalizeUrl()
      .maxLength(255)
      .optional()
      .nullable(),
  })
)

export const emailNotificationValidator = vine.compile(
  vine.object({
    emailOnComment: vine.boolean().optional(),
    emailOnCommentReply: vine.boolean().optional(),
    emailOnAchievement: vine.boolean().optional(),
    emailOnNewDeviceLogin: vine.boolean().optional(),
    emailOnWatchlist: vine.boolean().optional(),
    emailOnMention: vine.boolean().optional(),
  })
)
