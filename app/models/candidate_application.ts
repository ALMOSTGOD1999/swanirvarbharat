import { DateTime } from 'luxon'
import { column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel } from '@adonisjs/lucid/orm'
import { withID } from '#utils/with_id_mixin'
import User from '#models/user'

const AppSchema = compose(BaseModel, withID)

export default class CandidateApplication extends AppSchema {
  @column()
  declare userId: string

  @column()
  declare status: string

  // Personal Information
  @column()
  declare fullName: string | null

  @column()
  declare gender: string | null

  @column()
  declare age: number | null

  @column()
  declare educationalQualification: string | null

  // Document references (stored as JSON)
  @column({ columnName: 'certificate_10th' })
  declare certificate10th: any | null

  @column({ columnName: 'certificate_12th' })
  declare certificate12th: any | null

  @column()
  declare certificateGraduation: any | null

  @column()
  declare certificatePostGraduation: any | null

  @column()
  declare passportPhoto: any | null

  // Videos
  @column()
  declare introductionVideo: any | null

  @column()
  declare purposeVideo: any | null

  // KYC
  @column()
  declare kycType: string | null

  @column()
  declare kycDocument: any | null

  @column()
  declare phone: string | null

  @column()
  declare purposeDescription: string | null

  // Admin
  @column()
  declare adminRemarks: string | null

  @column()
  declare reviewedBy: string | null

  @column.dateTime({ autoCreate: false })
  declare reviewedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
