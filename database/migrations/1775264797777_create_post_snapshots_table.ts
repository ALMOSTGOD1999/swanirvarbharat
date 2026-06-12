import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'post_snapshots'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table
        .string('post_id', 24)
        .notNullable()
        .references('id')
        .inTable('posts')
        .onDelete('CASCADE')
      table.integer('revision').notNullable().unsigned()
      table.timestamp('revision_date', { useTz: true }).notNullable()
      table.integer('revised_by').notNullable().unsigned()
      table.string('title').notNullable()
      table.string('slug').notNullable()
      table.string('page_title', 100).nullable()
      table.string('description', 255).nullable()
      table.string('meta_description', 255).nullable()
      table.string('canonical', 255).nullable()
      table.text('body').nullable()
      table.string('video_url', 255).nullable()
      table.boolean('is_featured').nullable().defaultTo(false)
      table.boolean('is_personal').nullable().defaultTo(false)
      table.integer('view_count').notNullable().defaultTo(0).unsigned()
      table.integer('view_count_unique').unsigned().notNullable().defaultTo(0)
      table.integer('state_id').unsigned().notNullable()
      table.string('timezone', 50).nullable()
      table.string('publish_at_user').nullable()
      table.timestamp('published_at', { useTz: true }).nullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
