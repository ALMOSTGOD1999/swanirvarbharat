import { ReactElement } from 'react'
import { useFlashToasts } from '~/hooks/use_flash'
import { AppSidebar } from '~/components/app_sidebar'
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar'
import { AnchoredToastProvider, ToastProvider } from '~/components/ui/toast'
import { AbilityProvider } from '~/context/abilities_context'

export default function DashboardLayout({ children }: { children: ReactElement }) {
  useFlashToasts()

  return (
    <AbilityProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <ToastProvider position="top-center">
            <AnchoredToastProvider>{children}</AnchoredToastProvider>
          </ToastProvider>
        </SidebarInset>
      </SidebarProvider>
    </AbilityProvider>
  )
}
