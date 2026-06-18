import Link from 'next/link'
import { ListIcon, SearchXIcon } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export type ResourceView = 'all' | 'to-read' | 'reading' | 'finished'

type ResourcesEmptyProps = {
  view: ResourceView
  hasActiveFilters: boolean
  clearFiltersHref: string
}

const emptyContentByView: Record<
  ResourceView,
  {
    title: string
    description: string
  }
> = {
  all: {
    title: 'No resources yet',
    description:
      'You haven’t created any resources yet. Add your first resource to get started.',
  },
  'to-read': {
    title: 'Nothing to read yet',
    description:
      'Resources you save with the “To-read” status will appear here.',
  },
  reading: {
    title: 'Nothing in progress',
    description: 'Resources you are currently reading will appear here.',
  },
  finished: {
    title: 'No finished resources',
    description:
      'Resources you complete will appear here after you mark them as finished.',
  },
}

export function ResourcesEmpty({
  view,
  hasActiveFilters,
  clearFiltersHref,
}: ResourcesEmptyProps) {
  const content = emptyContentByView[view]

  if (hasActiveFilters) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchXIcon aria-hidden="true" />
          </EmptyMedia>

          <EmptyTitle>No matching resources</EmptyTitle>

          <EmptyDescription>
            No resources match your current search or category filter. Try
            changing or clearing the filters.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <Link
            href={clearFiltersHref}
            className={buttonVariants({ variant: 'outline' })}
          >
            Clear filters
          </Link>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ListIcon aria-hidden="true" />
        </EmptyMedia>

        <EmptyTitle>{content.title}</EmptyTitle>
        <EmptyDescription>{content.description}</EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <Link
          href="/resources/add"
          className={buttonVariants({ variant: 'default' })}
        >
          Add resource
        </Link>
      </EmptyContent>
    </Empty>
  )
}
