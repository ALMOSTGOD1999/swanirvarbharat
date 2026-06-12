import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'member_enrollments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table
        .string('user_id', 24)
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('resource_type', 32).notNullable()
      table.string('resource_id', 24).notNullable()
      table.string('status', 32).notNullable()
      table.integer('attempt_number').notNullable()
      table.text('reason').notNullable()
      table.json('context_links').nullable()
      table.string('video_source', 16).notNullable()
      table.json('video_file').nullable()
      table.string('video_url').nullable()
      table
        .string('reviewer_id', 24)
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.timestamp('reviewed_at').nullable()
      table.text('rejection_reason').nullable()
      table
        .string('revoked_by_id', 24)
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.timestamp('revoked_at').nullable()
      table.text('revocation_reason').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.index(['user_id'])
      table.index(['resource_type', 'resource_id'])
      table.index(['status'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
