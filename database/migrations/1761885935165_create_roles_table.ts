import { BaseSchema } from '@adonisjs/lucid/schema'
import { Roles } from '#enums/roles'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.enum('id', Object.values(Roles)).primary()
      table.string('name').notNullable()
      table.string('description').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
