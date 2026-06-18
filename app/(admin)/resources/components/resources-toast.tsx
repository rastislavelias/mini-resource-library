'use client'
import { useEffect, useRef } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import { getResourceStatus, isResourceStatus } from '@/lib/resources/status'

const toastMessages: Record<string, string> = {
  'resource-created': 'Resource added.',
  'resource-updated': 'Resource updated.',
  'resource-deleted': 'Resource deleted.',
}

export function ResourcesToast() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchParamsString = searchParams.toString()

  const lastShownToastRef = useRef<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString)
    const toastKey = params.get('toast')
    const movedTo = params.get('movedTo')

    if (!toastKey) {
      lastShownToastRef.current = null
      return
    }

    let message = toastMessages[toastKey]

    if (toastKey === 'resource-moved' && movedTo && isResourceStatus(movedTo)) {
      const status = getResourceStatus(movedTo)

      message = `Resource updated and moved to ${status.label}.`
    }

    if (!message) {
      return
    }

    const toastInstanceKey = `${toastKey}:${movedTo ?? ''}`

    if (lastShownToastRef.current === toastInstanceKey) {
      return
    }

    lastShownToastRef.current = toastInstanceKey

    toast.success(message)

    params.delete('toast')
    params.delete('movedTo')

    const queryString = params.toString()

    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    })
  }, [pathname, router, searchParamsString])

  return null
}
