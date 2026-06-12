import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Progresses extends BaseSchema {
  protected tableName = 'progresses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.string('user_id', 24).references('id').inTable('users').notNullable()
      table.string('post_id', 24).references('id').inTable('posts').nullable()
      table.integer('read_percent').unsigned().nullable()
      table.integer('watch_percent').unsigned().nullable()
      table.integer('watch_seconds').unsigned().notNullable().defaultTo(0)
      table.boolean('is_completed').notNullable().defaultTo(false)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.unique(['user_id', 'post_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
