import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'app_configs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.string('group', 100).notNullable().defaultTo('general')
      table.string('key', 100).notNullable()
      table.text('value').nullable()
      table.string('type', 20).notNullable().defaultTo('string')
      table.string('label', 255).nullable()
      table.text('description').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.unique(['group', 'key'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
