import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RequestVotes extends BaseSchema {
  protected tableName = 'request_votes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.string('user_id', 24).references('id').inTable('users').onDelete('CASCADE')
      table
        .string('lesson_request_id', 24)
        .references('id')
        .inTable('lesson_requests')
        .onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
