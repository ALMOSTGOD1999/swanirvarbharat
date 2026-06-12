import { BaseSchema } from '@adonisjs/lucid/schema'
import { CaptionTypes } from '#enums/captions'

export default class extends BaseSchema {
  protected tableName = 'post_captions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.string('post_id', 24).references('id').inTable('posts').notNullable()
      table.enum('type', Object.values(CaptionTypes.SRT)).notNullable().defaultTo(CaptionTypes.SRT)
      table.string('label', 50).notNullable()
      table.string('language', 10).notNullable()
      table.string('filename', 100).notNullable()
      table.integer('sort_order').notNullable().defaultTo(0)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
