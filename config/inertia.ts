import { defineConfig } from '@adonisjs/inertia'

const inertiaConfig = defineConfig({
  ssr: {
    enabled: true,
    entrypoint: 'inertia/ssr.tsx',
    pages: (_, page) => !page.startsWith('admin'),
  },
})

export default inertiaConfig
