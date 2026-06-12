import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'session_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table
        .string('user_id', 24)
        .references('id')
        .inTable('users')
        .notNullable()
        .onDelete('CASCADE')
      table.string('token').notNullable()
      table.string('ip_address', 50).nullable()
      table.string('user_agent').nullable()
      table.string('city').nullable()
      table.string('country').nullable()
      table.string('country_code').nullable()
      table.timestamp('login_at', { useTz: true }).nullable()
      table.boolean('login_successful').notNullable().defaultTo(false)
      table.timestamp('logout_at', { useTz: true }).nullable()
      table.boolean('force_logout').notNullable().defaultTo(false)
      table.timestamp('last_touched_at', { useTz: true }).nullable()
      table.string('browser_name', 50).nullable()
      table.string('browser_engine', 50).nullable()
      table.string('browser_version', 50).nullable()
      table.string('device_model', 50).nullable()
      table.string('device_type', 50).nullable()
      table.string('device_vendor', 50).nullable()
      table.string('os_name', 50).nullable()
      table.string('os_version', 50).nullable()
      table.string('session_id').notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
