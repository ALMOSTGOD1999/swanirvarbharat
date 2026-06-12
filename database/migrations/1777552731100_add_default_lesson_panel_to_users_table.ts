import { BaseSchema } from '@adonisjs/lucid/schema'
import { LessonPanels } from '#enums/lesson_panels'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('default_lesson_panel', 50).notNullable().defaultTo(LessonPanels.OVERVIEW)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('default_lesson_panel')
    })
  }
}
