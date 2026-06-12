import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'post_topics'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table
        .string('post_id', 24)
        .references('id')
        .inTable('posts')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('topic_id', 24)
        .references('id')
        .inTable('topics')
        .notNullable()
        .onDelete('CASCADE')
      table.integer('sort_order').notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
