'use client'

import { useSyncExternalStore } from 'react'

import { Toaster } from '@/components/ui/sonner'

const MEDIA_QUERY = '(max-width: 640px)'

function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia(MEDIA_QUERY)

  mediaQuery.addEventListener('change', callback)

  return () => {
    mediaQuery.removeEventListener('change', callback)
  }
}

function getSnapshot() {
  return window.matchMedia(MEDIA_QUERY).matches
}

function getServerSnapshot() {
  return false
}

export function ResponsiveToaster() {
  const isSmallScreen = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  return (
    <Toaster
      richColors
      closeButton
      position={isSmallScreen ? 'bottom-center' : 'top-right'}
    />
  )
}
