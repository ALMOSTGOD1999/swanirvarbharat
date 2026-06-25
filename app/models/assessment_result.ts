import { DateTime } from 'luxon'
import { column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel } from '@adonisjs/lucid/orm'
import { withID } from '#utils/with_id_mixin'
import User from '#models/user'
import Assessment from '#models/assessment'

const AppSchema = compose(BaseModel, withID)

export default class AssessmentResult extends AppSchema {
  @column()
  declare userId: string

  @column()
  declare assessmentId: string

  @column()
  declare score: number

  @column()
  declare total: number

  @column({
    prepare: (value: any) => (typeof value === 'object' ? JSON.stringify(value) : value),
    consume: (value: any) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare answers: any | null

  @column.dateTime({ autoCreate: false })
  declare completedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Assessment)
  declare assessment: BelongsTo<typeof Assessment>
}
