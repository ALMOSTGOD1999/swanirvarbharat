import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'candidate_applications'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('phone', 20).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('phone')
    })
  }
}
