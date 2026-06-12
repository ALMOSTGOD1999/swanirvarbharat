import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'topics'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table
        .string('user_id', 24)
        .references('id')
        .inTable('users')
        .notNullable()
        .onDelete('CASCADE')
      table.string('name', 50).notNullable()
      table.string('slug', 75).notNullable()
      table.boolean('is_featured').notNullable().defaultTo(false)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
