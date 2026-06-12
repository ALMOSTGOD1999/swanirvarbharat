import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Watchlists extends BaseSchema {
  protected tableName = 'watchlists'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.string('user_id', 24).references('id').inTable('users').notNullable()
      table.string('post_id', 24).references('id').inTable('posts').nullable()
      table.string('taxonomy_id', 24).references('id').inTable('taxonomies').nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
