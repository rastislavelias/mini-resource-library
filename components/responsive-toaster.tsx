'use client'
import { useEffect, useState } from 'react'

import { Toaster } from '@/components/ui/sonner'

export function ResponsiveToaster() {
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)')

    function handleChange(event: MediaQueryListEvent) {
      setIsSmallScreen(event.matches)
    }

    setIsSmallScreen(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return (
    <Toaster
      richColors
      closeButton
      position={isSmallScreen ? 'bottom-center' : 'top-right'}
    />
  )
}
