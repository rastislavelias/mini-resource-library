import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center px-6">
      <div className="max-w-md space-y-4 text-center">
        <p className="text-muted-foreground text-sm font-medium">404</p>

        <h1 className="text-3xl font-semibold tracking-tight">
          Page not found
        </h1>

        <p className="text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>

        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </main>
  )
}
