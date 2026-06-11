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
  const shownToastRef = useRef(false)

  useEffect(() => {
    if (shownToastRef.current) {
      return
    }

    const toastKey = searchParams.get('toast')

    if (!toastKey) {
      return
    }

    const message = toastMessages[toastKey]

    if (!message) {
      return
    }

    shownToastRef.current = true

    toast.success(message)

    router.replace('/categories', {
      scroll: false,
    })
  }, [router, searchParams])

  return null
}
