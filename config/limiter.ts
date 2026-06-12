import env from '#start/env'
import { defineConfig, stores } from '@adonisjs/limiter'

const limiterConfig = defineConfig({
  default: env.get('LIMITER_STORE'),
  stores: {
    /**
     * Redis store to save rate limiting data inside a
     * redis database.
     *
     * It is recommended to use a separate database for
     * the limiter connection.
     */
    redis: stores.redis({ keyPrefix: 'limiter:' }),

    /**
     * Database store to save rate limiting data inside a
     * MYSQL or PostgreSQL database.
     */
    database: stores.database({
      tableName: 'rate_limits',
      clearExpiredByTimeout: true,
    }),

    /**
     * Memory store could be used during
     * testing
     */
    memory: stores.memory({}),
  },
})

export default limiterConfig

declare module '@adonisjs/limiter/types' {
  export interface LimitersList extends InferLimiters<typeof limiterConfig> {}
}
