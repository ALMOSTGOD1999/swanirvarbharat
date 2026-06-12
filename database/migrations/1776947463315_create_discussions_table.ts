import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Discussions extends BaseSchema {
  protected tableName = 'discussions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.string('user_id', 24).references('id').inTable('users').notNullable()
      table.string('taxonomy_id', 24).references('id').inTable('taxonomies').nullable()
      table.integer('state_id').unsigned().notNullable().defaultTo(1)
      table.string('title', 100).notNullable().defaultTo('')
      table.string('slug', 200).notNullable().unique()
      table.text('body').notNullable().defaultTo('')
      table.integer('views').unsigned().notNullable().defaultTo(0)
      table.timestamp('solved_at').nullable()
      table.string('solved_comment_id', 24).nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
