import { ReactElement } from 'react'
import { Logo } from '~/components/logo'
import { AnchoredToastProvider, ToastProvider } from '~/components/ui/toast'
import { useFlashToasts } from '~/hooks/use_flash'

export default function MinimalLayout({ children }: { children: ReactElement }) {
  useFlashToasts()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-10">
      <div className="mb-8">
        <Logo />
      </div>
      <ToastProvider position="top-center">
        <AnchoredToastProvider>{children}</AnchoredToastProvider>
      </ToastProvider>
    </div>
  )
}
