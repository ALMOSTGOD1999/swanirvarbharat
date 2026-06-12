import { BaseSchema } from '@adonisjs/lucid/schema'

import { TaxonomyTypes } from '#enums/taxonomy'

export default class extends BaseSchema {
  protected tableName = 'taxonomies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.string('parent_id', 24).nullable().references('id').inTable(this.tableName)
      table.string('asset_id', 24).references('id').inTable('assets').nullable()
      table.string('name', 50).notNullable()
      table.string('slug', 100).notNullable()
      table.string('description', 255).notNullable().defaultTo('')
      table.string('page_title', 100).notNullable().defaultTo('')
      table.string('meta_description', 255).notNullable().defaultTo('')
      table.string('root_parent_id', 24).nullable().references('id').inTable(this.tableName)
      table.integer('level_index').unsigned()
      table.boolean('is_featured').notNullable().defaultTo(false)
      table.string('owner_id', 24).notNullable().references('id').inTable('users')
      table
        .enum('type', Object.values(TaxonomyTypes))
        .notNullable()
        .defaultTo(TaxonomyTypes.CONTENT)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
