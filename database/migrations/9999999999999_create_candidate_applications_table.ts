import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'candidate_applications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 24).primary()
      table.string('user_id', 24).notNullable().references('id').inTable('users').onDelete('CASCADE')

      // Status workflow: email_verified → onboarding_* → submitted → under_review → approved/rejected
      table.string('status', 50).notNullable().defaultTo('email_verified')

      // Personal Information (Step 3)
      table.string('full_name', 255).nullable()
      table.string('gender', 20).nullable()
      table.integer('age').nullable()
      table.string('educational_qualification', 255).nullable()

      // Document references as JSON (stored as { url, extname, size, name })
      table.jsonb('certificate_10th').nullable()
      table.jsonb('certificate_12th').nullable()
      table.jsonb('certificate_graduation').nullable()
      table.jsonb('certificate_post_graduation').nullable()
      table.jsonb('passport_photo').nullable()

      // Video references as JSON
      table.jsonb('introduction_video').nullable()
      table.jsonb('purpose_video').nullable()

      // KYC
      table.string('kyc_type', 50).nullable() // 'aadhaar' or 'voter_id'
      table.jsonb('kyc_document').nullable()

      // Purpose
      table.text('purpose_description').nullable()

      // Admin review
      table.text('admin_remarks').nullable()
      table.string('reviewed_by', 24).nullable().references('id').inTable('users')
      table.timestamp('reviewed_at', { useTz: true }).nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
