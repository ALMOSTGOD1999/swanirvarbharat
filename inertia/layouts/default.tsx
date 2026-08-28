import { ReactElement } from 'react'
import { useFlashToasts } from '~/hooks/use_flash'
import { useScrollToTop } from '~/hooks/use_scroll_to_top'
import { AnchoredToastProvider, ToastProvider } from '~/components/ui/toast'
import { Navbar } from '~/components/navbar'
import Footer from '~/components/footer'
import PageTransition from '~/components/page_transition'
import Chatbot from '~/components/chatbot'

export default function Layout({ children }: { children: ReactElement }) {
  useScrollToTop()
  useFlashToasts()

  return (
    <ToastProvider position="top-center">
      <AnchoredToastProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 pt-20">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <Chatbot />
        </div>
      </AnchoredToastProvider>
    </ToastProvider>
  )
}
