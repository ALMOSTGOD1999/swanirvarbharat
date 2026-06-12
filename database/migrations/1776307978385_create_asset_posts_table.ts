import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Assets extends BaseSchema {
  protected tableName = 'asset_posts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.string('post_id', 24).references('id').inTable('posts').notNullable()
      table.string('asset_id', 24).references('id').inTable('assets').notNullable()
      table.integer('sort_order').notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
