import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'series'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .string('access_level_id', 24)
        .nullable()
        .references('id')
        .inTable('access_levels')
        .onDelete('SET NULL')
      table.integer('enrollment_attempt_limit').notNullable().defaultTo(3)
      table.index(['access_level_id'])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['access_level_id'])
      table.dropColumn('access_level_id')
      table.dropColumn('enrollment_attempt_limit')
    })
  }
}
