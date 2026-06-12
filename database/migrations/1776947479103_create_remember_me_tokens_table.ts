import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RememberMeTokens extends BaseSchema {
  protected tableName = 'remember_me_tokens'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table
        .string('tokenable_id', 24)
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('hash').notNullable().unique()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
      table.timestamp('expires_at').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
