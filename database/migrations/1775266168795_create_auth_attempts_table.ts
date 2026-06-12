import { BaseSchema } from '@adonisjs/lucid/schema'

import { AuthAttemptPurposes } from '#enums/auth'

export default class extends BaseSchema {
  protected tableName = 'auth_attempts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.string('uid').notNullable()
      table.enum('purpose', Object.values(AuthAttemptPurposes)).notNullable().defaultTo(1)
      table.timestamp('deleted_at').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
