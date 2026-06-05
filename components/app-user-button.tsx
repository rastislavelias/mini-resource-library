'use client'
import { UserButton, useAuth } from '@clerk/nextjs'

import { Skeleton } from '@/components/ui/skeleton'

export function AppUserButton() {
  const { isLoaded } = useAuth()

  if (!isLoaded) return <Skeleton className="size-7 rounded-full" />

  return <UserButton />
}
