import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary().references('id').inTable('users').onDelete('CASCADE')
      table.string('name', 75).nullable()
      table.text('biography').nullable().defaultTo('')
      table.string('location', 255).nullable().defaultTo('')
      table.string('website', 255).nullable().defaultTo('')
      table.string('company', 255).nullable().defaultTo('')
      table.string('twitter_url', 255).nullable().defaultTo('')
      table.string('facebook_url', 255).nullable().defaultTo('')
      table.string('instagram_url', 255).nullable().defaultTo('')
      table.string('linkedin_url', 255).nullable().defaultTo('')
      table.string('youtube_url', 255).nullable().defaultTo('')
      table.string('github_url', 255).nullable().defaultTo('')
      table.string('bluesky_url', 255).nullable().defaultTo('')
      table.string('threads_url', 255).nullable().defaultTo('')
      table.boolean('email_on_comment').notNullable().defaultTo(true)
      table.boolean('email_on_comment_reply').notNullable().defaultTo(true)
      table.boolean('email_on_achievement').notNullable().defaultTo(true)
      table.boolean('email_on_new_device_login').notNullable().defaultTo(true)
      table.boolean('email_on_watchlist').notNullable().defaultTo(true)
      table.boolean('email_on_mention').notNullable().defaultTo(true)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
