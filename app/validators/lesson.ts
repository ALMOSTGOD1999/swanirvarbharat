import vine from '@vinejs/vine'
import { baseFilter } from '#validators/common'
import { lessonPanelValues } from '#enums/lesson_panels'

export const lessonIndexValidator = vine.create({
  ...baseFilter.getProperties(),
  topic: vine.string().trim().optional(),
  topics: vine.array(vine.string().trim()).optional(),
  sortBy: vine.string().trim().optional(),
  sortOrder: vine.enum(['asc', 'desc'] as const).optional(),
})

export const progressValidator = vine.create({
  postId: vine.string().fixedLength(24).exists({ table: 'posts', column: 'id' }),
  readPercent: vine.number().min(0).max(100).optional(),
  watchPercent: vine.number().min(0).max(100).optional(),
  watchSeconds: vine.number().min(0).optional(),
})

export const defaultLessonPanelValidator = vine.create({
  panel: vine.enum(lessonPanelValues),
})
