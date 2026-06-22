import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-muted mt-12 border-t px-6 py-12 text-sm text-zinc-600">
      <p className="max-w-xl lg:mx-auto lg:text-center">
        Mini Resource Library is a Next.js app that lets users save and manage
        private learning resources, focusing on authentication, database
        storage, and simple CRUD. The source code is available on{' '}
        <Link
          href="https://github.com/rastislavelias/mini-resource-library"
          target="_blank"
          className="inline-flex items-center gap-0.5 underline underline-offset-2"
        >
          GitHub <ExternalLink className="size-3" />
        </Link>
        . Created by{' '}
        <Link
          href="https://rastislavelias.com"
          target="_blank"
          className="inline-flex items-center gap-0.5 underline underline-offset-2"
        >
          Rastislav Elias <ExternalLink className="size-3" />
        </Link>
        .
      </p>
    </footer>
  )
}
