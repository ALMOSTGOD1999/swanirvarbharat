import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'author_posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table
        .string('user_id', 24)
        .references('id')
        .inTable('users')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('post_id', 24)
        .references('id')
        .inTable('posts')
        .notNullable()
        .onDelete('CASCADE')
      table.integer('author_type_id').unsigned().defaultTo(1)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
