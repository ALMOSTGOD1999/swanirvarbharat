import { BaseSchema } from '@adonisjs/lucid/schema'

export default class DiscussionViews extends BaseSchema {
  protected tableName = 'discussion_views'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.string('user_id', 24).references('id').inTable('users').nullable()
      table.string('discussion_id', 24).references('id').inTable('discussions').notNullable()
      table.integer('type_id').unsigned().notNullable().defaultTo(1)
      table.string('ip_address', 45).notNullable()
      table.string('user_agent', 255).notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
