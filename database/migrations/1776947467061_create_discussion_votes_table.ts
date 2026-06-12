import { BaseSchema } from '@adonisjs/lucid/schema'

export default class DiscussionVotes extends BaseSchema {
  protected tableName = 'discussion_votes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.string('user_id', 24).references('id').inTable('users').nullable()
      table.string('discussion_id', 24).references('id').inTable('discussions').nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
