import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comment_votes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.string('user_id', 24).references('id').inTable('users').notNullable()
      table.string('comment_id', 24).references('id').inTable('comments').notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.unique(['user_id', 'comment_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
