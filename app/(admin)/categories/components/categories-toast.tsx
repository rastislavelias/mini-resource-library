'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

const toastMessages: Record<string, string> = {
  'category-created': 'Category added.',
  'category-updated': 'Category updated.',
  'category-deleted': 'Category deleted.',
}

export function CategoriesToast() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const lastShownToastRef = useRef<string | null>(null)

  useEffect(() => {
    const toastKey = searchParams.get('toast')

    if (!toastKey) {
      lastShownToastRef.current = null
      return
    }

    const message = toastMessages[toastKey]

    if (!message) {
      return
    }

    if (lastShownToastRef.current === toastKey) {
      return
    }

    lastShownToastRef.current = toastKey

    toast.success(message)
    router.replace('/categories', { scroll: false })
  }, [router, searchParams])

  return null
}
