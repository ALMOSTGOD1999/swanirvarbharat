import vine from '@vinejs/vine'
import { DateTime } from 'luxon'
import { baseFilter, imageFile, imageFileWithRemove } from '#validators/common'
import { PostTypes } from '#enums/posts'
import { States } from '#enums/states'
import { BodyTypes } from '#enums/body'
import { VideoTypes } from '#enums/videos'

export const filterPostsValidator = vine.create({
  ...baseFilter.getProperties(),
  types: vine.array(vine.enum(Object.values(PostTypes))).optional(),
  states: vine.array(vine.enum(Object.values(States))).optional(),
  authorIds: vine.array(vine.string().fixedLength(24)).optional(),
  taxonomyNames: vine.array(vine.string().trim()).optional(),
  dateFrom: vine
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  dateTo: vine
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  sortBy: vine.string().trim().optional(),
  sortOrder: vine.enum(['asc', 'desc'] as const).optional(),
})

const title = () => vine.string().trim().maxLength(200).minLength(3)
const slug = () => vine.string().trim().maxLength(255)

const pageTitle = () => vine.string().trim().maxLength(255)
const description = () => vine.string().trim().maxLength(255)
const metaDescription = () => vine.string().trim().maxLength(255)
const canonical = () => vine.string().trim().maxLength(255).url()
const videoUrl = () => vine.string().trim().maxLength(255).url()
const redirectUrl = () => vine.string().trim().maxLength(255).url()
const livestreamUrl = () => vine.string().trim().maxLength(255).url()
const timezone = () => vine.string().trim().maxLength(100)
const publishAtDate = () =>
  vine
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
const publishAtTime = () =>
  vine
    .string()
    .trim()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)

/**
 * Compute the publishAt DateTime from date, time, and timezone.
 * Use this in controllers after validation to get the UTC DateTime.
 */
export const computePublishAt = (data: {
  publishAtDate?: string | null
  publishAtTime?: string | null
  timezone?: string | null
}): DateTime | null => {
  if (!data.publishAtDate && !data.publishAtTime) {
    return null
  }

  const tz = data.timezone || 'UTC'
  let publishAt = DateTime.now().setZone(tz)

  if (data.publishAtDate) {
    const { year, month, day } = DateTime.fromFormat(data.publishAtDate, 'yyyy-MM-dd')
    publishAt = publishAt.set({ year, month, day })
  }

  if (data.publishAtTime) {
    const { hour, minute } = DateTime.fromFormat(data.publishAtTime, 'HH:mm')
    publishAt = publishAt.set({ hour, minute })
  }

  return publishAt.setZone('UTC').set({ second: 0, millisecond: 0 })
}

export const createPostValidator = vine.create({
  title: title(),
  slug: slug()
    .unique(async (db, value, field) => {
      const result = await db
        .from('posts')
        .select('id')
        .whereILike('slug', value)
        .if(field.meta.id, (query) => query.whereNot('id', field.meta.id))
        .first()
      return !result
    })
    .optional(),
  pageTitle: pageTitle().optional().nullable(),
  description: description().optional().nullable(),
  metaDescription: metaDescription().optional().nullable(),
  canonical: canonical().optional().nullable(),
  body: vine.string().trim().nullable(),
  videoUrl: videoUrl().optional().nullable(),
  isFeatured: vine.boolean().optional(),
  isPersonal: vine.boolean().optional(),
  state: vine.enum(Object.values(States)).optional(),
  timezone: timezone().optional().nullable(),
  publishedAtUser: vine
    .date({ formats: ['iso8601'] })
    .optional()
    .nullable(),
  publishAtDate: publishAtDate().optional().nullable(),
  publishAtTime: publishAtTime().optional().nullable(),
  postType: vine.enum(Object.values(PostTypes)).optional(),
  redirectUrl: redirectUrl().optional().nullable(),
  bodyBlocks: vine.any().optional().nullable(),
  bodyType: vine.enum(Object.values(BodyTypes)).optional(),
  isLivestream: vine.boolean().optional(),
  livestreamUrl: livestreamUrl().optional().nullable(),
  videoType: vine.enum(Object.values(VideoTypes)).optional(),
  videoBunnyId: vine.string().trim().maxLength(500).optional().nullable(),

  taxonomyIds: vine.array(vine.string().fixedLength(24)).optional(),
  thumbnail: imageFile.optional(),
})

export const updatePostValidator = vine.create({
  title: title().optional(),
  slug: slug()
    .unique(async (db, value, field) => {
      const result = await db
        .from('posts')
        .select('id')
        .whereILike('slug', value)
        .if(field.data.params.id, (query) => query.whereNot('id', field.data.params.id))
        .first()
      return !result
    })
    .optional(),
  pageTitle: pageTitle().optional().nullable(),
  description: description().optional().nullable(),
  metaDescription: metaDescription().optional().nullable(),
  canonical: canonical().optional().nullable(),
  body: vine.string().trim().optional().nullable(),
  videoUrl: videoUrl().optional().nullable(),
  isFeatured: vine.boolean().optional(),
  isPersonal: vine.boolean().optional(),
  state: vine.enum(Object.values(States)).optional(),
  timezone: timezone().optional().nullable(),
  publishedAtUser: vine
    .date({ formats: ['iso8601'] })
    .optional()
    .nullable(),
  publishAtDate: publishAtDate().optional().nullable(),
  publishAtTime: publishAtTime().optional().nullable(),
  postType: vine.enum(Object.values(PostTypes)).optional(),
  redirectUrl: redirectUrl().optional().nullable(),
  bodyBlocks: vine.any().optional().nullable(),
  bodyType: vine.enum(Object.values(BodyTypes)).optional(),
  isLivestream: vine.boolean().optional(),
  livestreamUrl: livestreamUrl().optional().nullable(),
  videoType: vine.enum(Object.values(VideoTypes)).optional(),
  videoBunnyId: vine.string().trim().maxLength(500).optional().nullable(),

  taxonomyIds: vine.array(vine.string().fixedLength(24)).optional(),
  thumbnail: imageFileWithRemove.optional(),
})
