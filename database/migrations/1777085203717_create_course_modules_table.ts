import { BaseSchema } from '@adonisjs/lucid/schema'
import { States } from '#enums/states'

export default class extends BaseSchema {
  protected tableName = 'course_modules'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table
        .string('course_id', 24)
        .notNullable()
        .references('id')
        .inTable('courses')
        .onDelete('CASCADE')
      table.string('name').notNullable()
      table.text('notes').nullable()
      table.enum('state', Object.values(States)).notNullable().defaultTo(States.DRAFT)
      table.integer('sort_order').unsigned().notNullable().defaultTo(0)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
