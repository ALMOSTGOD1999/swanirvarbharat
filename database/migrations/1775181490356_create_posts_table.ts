import { BaseSchema } from '@adonisjs/lucid/schema'

import { States } from '#enums/states'
import { PostTypes } from '#enums/posts'
import { BodyTypes } from '#enums/body'
import { VideoTypes } from '#enums/videos'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.string('title', 200).notNullable()
      table.string('slug').notNullable().unique()
      table.string('page_title').nullable()
      table.string('description').nullable()
      table.string('meta_description').nullable()
      table.string('canonical').nullable()
      table.text('body').nullable()
      table.string('video_url').nullable()
      table.boolean('is_featured').notNullable().defaultTo(false)
      table.boolean('is_personal').notNullable().defaultTo(false)
      table.integer('view_count').unsigned().notNullable().defaultTo(0)
      table.integer('view_count_unique').unsigned().notNullable().defaultTo(0)
      table.enum('state', Object.values(States)).notNullable().defaultTo(States.DRAFT)
      table.string('timezone', 100).nullable()
      table.timestamp('published_at_user', { useTz: true }).nullable()
      table.timestamp('published_at', { useTz: true }).nullable()
      table.integer('read_minutes').unsigned().notNullable().defaultTo(0)
      table.integer('read_time').unsigned().notNullable().defaultTo(0)
      table.integer('word_count').unsigned().notNullable().defaultTo(0)
      table.integer('video_seconds').unsigned().notNullable().defaultTo(0)
      table.enum('post_type', Object.values(PostTypes)).notNullable().defaultTo(PostTypes.LESSON)
      table.string('redirect_url').nullable()
      table.jsonb('body_blocks').nullable()
      table.enum('body_type', Object.values(BodyTypes)).notNullable().defaultTo(BodyTypes.HTML)
      table.boolean('is_livestream').notNullable().defaultTo(false)
      table.string('livestream_url').nullable()
      table.enum('video_type', Object.values(VideoTypes)).notNullable().defaultTo(VideoTypes.NONE)
      table.string('video_bunny_id', 500).nullable()
      table.boolean('is_watchlist_sent').notNullable().defaultTo(false)
      table.timestamp('updated_content_at', { useTz: true }).nullable()
      table.string('repository_url').nullable()
      table.integer('repository_access_level').unsigned().notNullable().defaultTo(1)
      table.timestamp('rag_added_at', { useTz: true }).nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
