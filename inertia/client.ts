import { registry } from '@generated/registry/index'
import { createTuyau } from '@tuyau/core/client'
import { QueryClient } from '@tanstack/react-query'
import { createTuyauReactQueryClient } from '@tuyau/react-query'

export const queryClient = new QueryClient({})

export const client = createTuyau({
  baseUrl: '/',
  registry,
  credentials: 'include',
})

export const api = createTuyauReactQueryClient({ client })

export const urlFor = client.urlFor
