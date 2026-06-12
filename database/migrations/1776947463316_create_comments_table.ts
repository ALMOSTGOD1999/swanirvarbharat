import { BaseSchema } from '@adonisjs/lucid/schema'
import { CommentTypeIdColumn } from '#enums/comments'

export default class Comments extends BaseSchema {
  protected tableName = 'comments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.string('name').nullable()
      table.string('post_id', 24).references('id').inTable('posts').nullable()
      table.string('user_id', 24).references('id').inTable('users').nullable()
      table.string('reply_to', 24).references('id').inTable(this.tableName).nullable()
      table.integer('state_id').unsigned().notNullable()
      table.string('identity').notNullable()
      table.text('body')
      table
        .string('root_parent_id', 24)
        .nullable()
        .references('id')
        .inTable(this.tableName)
        .nullable()
      table.enum('type', Object.values(CommentTypeIdColumn)).defaultTo(CommentTypeIdColumn.POST)
      table.integer('level_index').notNullable().defaultTo(0)
      table.string('discussion_id', 24).nullable().references('id').inTable('discussions')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
