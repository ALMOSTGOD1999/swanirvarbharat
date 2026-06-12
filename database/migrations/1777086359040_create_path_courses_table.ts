import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'path_courses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.string('path_id', 24).references('id').inTable('paths').onDelete('CASCADE')
      table.string('course_id', 24).references('id').inTable('courses').onDelete('CASCADE')
      table.integer('sort_order').unsigned().notNullable().defaultTo(0)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
