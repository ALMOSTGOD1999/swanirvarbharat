import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Histories extends BaseSchema {
  protected tableName = 'histories'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.string('user_id', 24).references('id').inTable('users').notNullable()
      table.string('post_id', 24).references('id').inTable('posts').nullable()
      table.string('taxonomy_id', 24).references('id').inTable('taxonomies').nullable()
      table.integer('history_type_id').unsigned().notNullable().defaultTo(1)
      table.string('route').notNullable()
      table.integer('read_percent').unsigned().nullable()
      table.integer('watch_percent').unsigned().nullable()
      table.boolean('is_completed').notNullable().defaultTo(false)
      table.integer('watch_seconds').unsigned().notNullable().defaultTo(0)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
