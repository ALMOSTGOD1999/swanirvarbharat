import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Blocks extends BaseSchema {
  protected tableName = 'blocks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.string('user_id', 24).references('id').inTable('users').nullable()
      table.integer('section_id').unsigned().notNullable().defaultTo(1)
      table.string('ip_address').notNullable()
      table.string('reason').nullable()
      table.timestamp('expires_at', { useTz: true }).nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
