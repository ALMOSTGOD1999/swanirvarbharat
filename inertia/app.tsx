import './css/app.css'
import { client, queryClient } from './client'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '~/hooks/use_theme'
import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClientProvider } from '@tanstack/react-query'

const appName = import.meta.env.VITE_APP_NAME || 'Swanirvarbharat'

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) => {
    return resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx'))
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <QueryClientProvider client={queryClient}>
        <TuyauProvider client={client}>
          <ThemeProvider>
            <App {...props} />
            <TanStackDevtools
              plugins={[
                {
                  name: 'TanStack Query',
                  render: <ReactQueryDevtoolsPanel />,
                },
              ]}
            />
          </ThemeProvider>
        </TuyauProvider>
      </QueryClientProvider>
    )
  },
  progress: {
    color: 'var(--muted-foreground)',
  },
}).then()
