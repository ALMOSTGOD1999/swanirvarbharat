import { BaseSchema } from '@adonisjs/lucid/schema'
import { States } from '#enums/states'
import { Difficulties } from '#enums/difficulties'

export default class extends BaseSchema {
  protected tableName = 'courses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.string('owner_id', 24).references('id').inTable('users')
      table.string('access_level_id', 24).references('id').inTable('access_levels')
      table.string('asset_id', 24).nullable().references('id').inTable('assets').onDelete('CASCADE')
      table.string('name').notNullable()
      table.string('slug', 200).notNullable().unique()
      table.string('description').notNullable().defaultTo('')
      table
        .enum('difficulty', Object.values(Difficulties))
        .notNullable()
        .defaultTo(Difficulties.BEGINNER)
      table.enum('state', Object.values(States)).notNullable().defaultTo(States.DRAFT)
      table.boolean('is_featured').notNullable().defaultTo(false)
      table.string('page_title').notNullable().defaultTo('')
      table.string('meta_description').notNullable().defaultTo('')
      table.integer('sort_order').unsigned().notNullable().defaultTo(0)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
