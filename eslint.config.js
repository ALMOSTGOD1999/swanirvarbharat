import { configApp } from '@adonisjs/eslint-config'

export default [
  ...configApp(),
  {
    files: ['inertia/**/*'],
    rules: {
      '@adonisjs/no-backend-import-in-frontend': ['error', { allowed: ['#enums/*'] }],
    },
  },
]
