import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('assessments', (table) => {
      table.string('id', 24).primary()
      table.string('post_id', 24).notNullable().references('id').inTable('posts').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })

    this.schema.createTable('assessment_questions', (table) => {
      table.string('id', 24).primary()
      table.string('assessment_id', 24).notNullable().references('id').inTable('assessments').onDelete('CASCADE')
      table.text('question').notNullable()
      table.text('option_a').notNullable()
      table.text('option_b').notNullable()
      table.text('option_c').notNullable()
      table.text('option_d').notNullable()
      table.string('correct_answer', 1).notNullable()
      table.integer('sort_order').notNullable().defaultTo(0)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })

    this.schema.createTable('assessment_results', (table) => {
      table.string('id', 24).primary()
      table.string('user_id', 24).notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('assessment_id', 24).notNullable().references('id').inTable('assessments').onDelete('CASCADE')
      table.integer('score').notNullable()
      table.integer('total').notNullable()
      table.jsonb('answers').nullable()
      table.timestamp('completed_at', { useTz: true }).notNullable()
      table.unique(['user_id', 'assessment_id'])
    })
  }

  async down() {
    this.schema.dropTable('assessment_results')
    this.schema.dropTable('assessment_questions')
    this.schema.dropTable('assessments')
  }
}
