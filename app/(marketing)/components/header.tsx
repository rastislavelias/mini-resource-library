'use client'
import Link from 'next/link'
import { Library } from 'lucide-react'

import { AuthActions } from './auth-actions'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-4 lg:px-6">
      <Link href="/" className="flex items-center gap-2">
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
          <Library className="size-4" />
        </div>

        <span className="sr-only text-sm leading-tight font-medium sm:not-sr-only">
          Mini Resource Library
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <AuthActions />
      </div>
    </header>
  )
}
