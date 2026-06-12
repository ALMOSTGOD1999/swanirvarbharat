import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

import env from '#start/env'

const dbConfig = defineConfig({
  connection: 'pg',
  connections: {
    pg: {
      client: 'pg',
      connection: env.get('DATABASE_URL'),
      pool: {
        min: 1,
        max: 5,
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      debug: app.inDev,
    },
  },
})

export default dbConfig
