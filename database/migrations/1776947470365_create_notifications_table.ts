import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Notifications extends BaseSchema {
  protected tableName = 'notifications'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.boolean('global').notNullable().defaultTo(false)
      table.string('user_id', 24).references('id').inTable('users').notNullable()
      table.string('initiator_user_id', 24).references('id').inTable('users').nullable()
      table.integer('notification_type_id').unsigned().notNullable()
      table.string('table_name').nullable()
      table.string('table_id', 24).nullable()
      table.string('title').notNullable()
      table.text('body').notNullable()
      table.string('href').nullable()
      table.timestamp('read_at').nullable()
      table.timestamp('actioned_at').nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
