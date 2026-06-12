import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table
        .string('role_id', 24)
        .notNullable()
        .references('id')
        .inTable('roles')
        .onDelete('CASCADE')
      table.string('username', 50).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.json('avatar').nullable()
      table.timestamp('email_verified_at', { useTz: true }).nullable()
      table.string('google_id').nullable()
      table.string('google_email', 500).nullable()
      table.string('theme', 50).notNullable().defaultTo('system')
      table.boolean('is_enabled_mentions').defaultTo(true)
      table.boolean('is_enabled_profile').notNullable().defaultTo(true)
      table.boolean('is_enabled_mini_player').notNullable().defaultTo(true)
      table.boolean('is_enabled_autoplay_next').notNullable().defaultTo(true)
      table.boolean('is_enabled_transcript').notNullable().defaultTo(false)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
