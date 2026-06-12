import { BaseSchema } from '@adonisjs/lucid/schema'

export default class LessonRequests extends BaseSchema {
  protected tableName = 'lesson_requests'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.string('user_id', 24).references('id').inTable('users').notNullable()
      table.integer('state_id').unsigned().notNullable().defaultTo(2)
      table.integer('priority').unsigned().notNullable().defaultTo(1)
      table.string('name').notNullable()
      table.text('body')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
