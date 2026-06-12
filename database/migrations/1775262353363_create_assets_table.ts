import { BaseSchema } from '@adonisjs/lucid/schema'
import { AssetTypes } from '#enums/asset'

export default class extends BaseSchema {
  protected tableName = 'assets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.json('asset').notNullable()
      table.enum('type', Object.values(AssetTypes)).notNullable().defaultTo(AssetTypes.THUMBNAIL)
      table.string('alt_text').notNullable().defaultTo('')
      table.string('credit').notNullable().defaultTo('')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
