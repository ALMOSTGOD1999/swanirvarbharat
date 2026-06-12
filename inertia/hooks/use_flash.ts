import { useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { type Data } from '@generated/data'
import { toastManager } from '~/components/ui/toast'

export function useFlashToasts() {
  const { flash } = usePage<Data.SharedProps>().props

  useEffect(() => {
    if (flash.error) {
      toastManager.add({ type: 'error', title: 'Error', description: flash.error })
    }
    if (flash.success) {
      toastManager.add({ type: 'success', title: 'Success', description: flash.success })
    }
  }, [flash])
}
