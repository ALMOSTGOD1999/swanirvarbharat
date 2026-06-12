import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'member_enrollment_events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table
        .string('member_enrollment_id', 24)
        .notNullable()
        .references('id')
        .inTable('member_enrollments')
        .onDelete('CASCADE')
      table.string('actor_id', 24).nullable().references('id').inTable('users').onDelete('SET NULL')
      table.string('event_type', 32).notNullable()
      table.string('from_status', 32).nullable()
      table.string('to_status', 32).nullable()
      table.text('note').nullable()
      table.json('snapshot').nullable()
      table.timestamp('created_at')
      table.index(['member_enrollment_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
