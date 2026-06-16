import { DateTime } from 'luxon'
import { column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel } from '@adonisjs/lucid/orm'
import { withID } from '#utils/with_id_mixin'
import Assessment from '#models/assessment'

const AppSchema = compose(BaseModel, withID)

export default class AssessmentQuestion extends AppSchema {
  @column()
  declare assessmentId: string

  @column()
  declare question: string

  @column()
  declare optionA: string

  @column()
  declare optionB: string

  @column()
  declare optionC: string

  @column()
  declare optionD: string

  @column()
  declare correctAnswer: string

  @column()
  declare sortOrder: number

  @belongsTo(() => Assessment)
  declare assessment: BelongsTo<typeof Assessment>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
