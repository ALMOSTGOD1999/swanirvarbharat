import { BaseSchema } from '@adonisjs/lucid/schema'

export default class PostTaxonomies extends BaseSchema {
  protected tableName = 'post_taxonomies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('post_id', 24).references('id').inTable('posts')
      table.string('taxonomy_id', 24).references('id').inTable('taxonomies')
      table.integer('sort_order').unsigned().notNullable().defaultTo(0)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
