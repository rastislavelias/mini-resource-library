'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { RESOURCE_PAGE_SIZE } from '@/lib/resources/constants'

import { Button } from '@/components/ui/button'

type ResourcePaginationProps = {
  currentPage: number
  totalPages: number
  totalCount: number
}

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
}: ResourcePaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const firstItem = (currentPage - 1) * RESOURCE_PAGE_SIZE + 1
  const lastItem = Math.min(currentPage * RESOURCE_PAGE_SIZE, totalCount)

  function getPageHref(page: number) {
    const params = new URLSearchParams(searchParams)

    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', String(page))
    }

    const queryString = params.toString()

    return queryString ? `${pathname}?${queryString}` : pathname
  }

  return (
    <nav
      aria-label="Resources pagination"
      className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-muted-foreground text-sm">
        Showing {firstItem}–{lastItem} of {totalCount}
      </p>

      <div className="flex items-center gap-3">
        {currentPage === 1 ? (
          <Button variant="outline" size="sm" disabled>
            <ChevronLeftIcon aria-hidden="true" />
            Previous
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm">
            <Link href={getPageHref(currentPage - 1)}>
              <ChevronLeftIcon aria-hidden="true" />
              Previous
            </Link>
          </Button>
        )}

        <span className="text-sm tabular-nums">
          Page {currentPage} of {totalPages}
        </span>

        {currentPage === totalPages ? (
          <Button variant="outline" size="sm" disabled>
            Next
            <ChevronRightIcon aria-hidden="true" />
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm">
            <Link href={getPageHref(currentPage + 1)}>
              Next
              <ChevronRightIcon aria-hidden="true" />
            </Link>
          </Button>
        )}
      </div>
    </nav>
  )
}
