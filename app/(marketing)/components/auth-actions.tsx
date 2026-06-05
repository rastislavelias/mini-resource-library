'use client'
import Link from 'next/link'
import { SignInButton, SignUpButton, useAuth } from '@clerk/nextjs'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function AuthActions() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) return <Skeleton className="h-8 w-[150px]" />

  return (
    <div className="flex items-center gap-2">
      {isSignedIn ? (
        <Button asChild>
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      ) : (
        <>
          <SignUpButton mode="modal">
            <Button>Sign up</Button>
          </SignUpButton>

          <SignInButton mode="modal">
            <Button variant="outline">Sign in</Button>
          </SignInButton>
        </>
      )}
    </div>
  )
}
