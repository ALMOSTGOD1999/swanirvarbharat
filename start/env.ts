/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring session package
  |----------------------------------------------------------
  */
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory', 'database'] as const),

  DATABASE_URL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the mail package
  |----------------------------------------------------------
  */
  MAIL_MAILER: Env.schema.enum(['smtp', 'resend'] as const),
  SMTP_HOST: Env.schema.string.optionalWhen(() => process.env.MAIL_MAILER === 'resend'),
  SMTP_PORT: Env.schema.number.optionalWhen(() => process.env.MAIL_MAILER === 'resend'),
  RESEND_API_KEY: Env.schema.string.optionalWhen(() => process.env.MAIL_MAILER === 'smtp'),

  VITE_APP_NAME: Env.schema.string(),
  APP_CONTACT_EMAIL: Env.schema.string(),
  APP_DOMAIN: Env.schema.string(),
  APP_KEY: Env.schema.secret(),
  VITE_APP_URL: Env.schema.string({ format: 'url', tld: false }),

  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.secret.optional(),
  REDIS_DB: Env.schema.number.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the limiter package
  |----------------------------------------------------------
  */
  LIMITER_STORE: Env.schema.enum(['redis', 'memory', 'database'] as const),

  /*
  |----------------------------------------------------------
  | Variables for configuring ally package
  |----------------------------------------------------------
  */
  GOOGLE_CLIENT_ID: Env.schema.string(),
  GOOGLE_CLIENT_SECRET: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the drive package
  |----------------------------------------------------------
  */
  DRIVE_DISK: Env.schema.enum(['fs', 's3'] as const),
  S3_ACCESS_KEY_ID: Env.schema.string.optionalWhen(process.env.DRIVE_DISK === 'fs'),
  S3_SECRET_ACCESS_KEY: Env.schema.string.optionalWhen(process.env.DRIVE_DISK === 'fs'),
  S3_REGION: Env.schema.string.optionalWhen(process.env.DRIVE_DISK === 'fs'),
  S3_BUCKET: Env.schema.string.optionalWhen(process.env.DRIVE_DISK === 'fs'),
  S3_ENDPOINT: Env.schema.string.optionalWhen(process.env.DRIVE_DISK === 'fs'),

  IP2_LOCATION_TOKEN: Env.schema.string(),
})
