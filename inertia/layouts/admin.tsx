import { ReactElement } from 'react'

import { useFlashToasts } from '~/hooks/use_flash'
import { AdminSidebar } from '~/components/admin_sidebar'
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar'
import { AnchoredToastProvider, ToastProvider } from '~/components/ui/toast'
import { AbilityProvider } from '~/context/abilities_context'
import { cn } from '~/lib/utils'

export default function AdminLayout({ children }: { children: ReactElement }) {
  useFlashToasts()

  return (
    <AbilityProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset
          className={cn(
            // Set content container, so we can use container queries
            '@container/content',

            // If layout is fixed, set the height
            // to 100svh to prevent overflow
            'has-data-[layout=fixed]:h-svh',

            // If layout is fixed and sidebar is inset,
            // set the height to 100svh - spacing (total margins) to prevent overflow
            'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
          )}
        >
          <ToastProvider position="top-center">
            <AnchoredToastProvider>{children}</AnchoredToastProvider>
          </ToastProvider>
        </SidebarInset>
      </SidebarProvider>
    </AbilityProvider>
  )
}
