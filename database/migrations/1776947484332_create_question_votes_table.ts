import { BaseSchema } from '@adonisjs/lucid/schema'

export default class QuestionVotes extends BaseSchema {
  protected tableName = 'question_votes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.string('user_id', 24).references('id').inTable('users').nullable()
      table.string('question_id', 24).references('id').inTable('questions').nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.unique(['user_id', 'question_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
