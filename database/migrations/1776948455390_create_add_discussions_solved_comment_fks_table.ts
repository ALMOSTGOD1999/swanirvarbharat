import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'discussions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.foreign('solved_comment_id').references('id').inTable('comments').onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('solved_comment_id')
    })
  }
}
