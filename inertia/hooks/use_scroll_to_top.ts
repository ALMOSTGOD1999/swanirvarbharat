import { useEffect } from 'react'
import { usePage } from '@inertiajs/react'

export function useScrollToTop() {
  const { url } = usePage()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [url])
}
