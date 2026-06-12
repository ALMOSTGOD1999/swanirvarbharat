import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { withID } from '#utils/with_id_mixin'
import { DateTime } from 'luxon'

export default class AppConfig extends compose(BaseModel, withID) {
  @column()
  declare group: string

  @column()
  declare key: string

  @column()
  declare value: string | null

  @column()
  declare type: string

  @column()
  declare label: string | null

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Get typed value based on the type field
   */
  getTypedValue(): string | number | boolean | null {
    if (this.value === null) return null
    switch (this.type) {
      case 'number':
        return Number(this.value)
      case 'boolean':
        return this.value === 'true'
      default:
        return this.value
    }
  }
}
