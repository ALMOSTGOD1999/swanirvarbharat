import { DateTime } from 'luxon'
import { column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel } from '@adonisjs/lucid/orm'
import { withID } from '#utils/with_id_mixin'
import Post from '#models/post'
import AssessmentQuestion from '#models/assessment_question'

const AppSchema = compose(BaseModel, withID)

export default class Assessment extends AppSchema {
  @column()
  declare postId: string

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>

  @hasMany(() => AssessmentQuestion)
  declare questions: HasMany<typeof AssessmentQuestion>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
