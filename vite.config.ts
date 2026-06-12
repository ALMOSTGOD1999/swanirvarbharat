import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import adonisjs from '@adonisjs/vite/client'
import tailwindcss from '@tailwindcss/vite'
import inertia from '@adonisjs/inertia/vite'
import { devtools } from '@tanstack/devtools-vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    inertia({ ssr: { enabled: true, entrypoint: 'inertia/ssr.tsx' } }),
    adonisjs({ entrypoints: ['inertia/app.tsx'], reload: ['resources/views/**/*.edge'] }),
    devtools(),
  ],

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      '~/': `${import.meta.dirname}/inertia/`,
      '@generated': `${import.meta.dirname}/.adonisjs/client/`,
    },
  },

  server: {
    watch: {
      ignored: ['**/storage/**', '**/tmp/**'],
    },
    allowedHosts: [`.${process.env.APP_DOMAIN}`],
  },
})
