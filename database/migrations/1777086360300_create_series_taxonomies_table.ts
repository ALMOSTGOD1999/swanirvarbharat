import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'series_taxonomies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table
        .string('series_id', 24)
        .notNullable()
        .references('id')
        .inTable('series')
        .onDelete('CASCADE')
      table
        .string('taxonomy_id', 24)
        .notNullable()
        .references('id')
        .inTable('taxonomies')
        .onDelete('CASCADE')
      table.integer('sort_order').unsigned().notNullable().defaultTo(0)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
