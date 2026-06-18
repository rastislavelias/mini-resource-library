import { CalendarIcon, ExternalLinkIcon, StarIcon } from 'lucide-react'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CategoryBadge } from '@/components/category-badge'
import { ResourceActions } from './resource-actions'
import { formatDate } from '@/lib/format-date'

import type { ResourceStatus, CategoryColor } from '@/generated/prisma/enums'
export type Resource = {
  id: string
  title: string
  url: string
  status: ResourceStatus
  rating: number | null
  notes: string | null
  createdAt: Date
  category: {
    name: string
    color: CategoryColor
  }
}

export function ResourceItem({ resource }: { resource: Resource }) {
  return (
    <Card>
      <CardHeader className="min-w-0 space-y-2 has-data-[slot=card-action]:grid-cols-[minmax(0,1fr)_auto]">
        <CategoryBadge
          color={resource.category.color}
          name={resource.category.name}
        />

        <CardTitle>{resource.title}</CardTitle>

        <CardDescription className="mb-0! min-w-0">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-visible:outline-ring inline-flex max-w-full min-w-0 items-center gap-1 rounded-sm text-blue-600 underline underline-offset-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-blue-400"
          >
            <span className="min-w-0 flex-1 truncate">{resource.url}</span>
            <ExternalLinkIcon className="size-4 flex-none" aria-hidden="true" />
          </a>
        </CardDescription>

        <CardAction>
          <ResourceActions resource={resource} />
        </CardAction>
      </CardHeader>
      {resource.notes && (
        <CardContent>
          <p>{resource.notes}</p>
        </CardContent>
      )}
      <CardFooter className="mt-auto flex items-center justify-between gap-2">
        <p className="text-muted-foreground flex items-center gap-2 text-xs">
          <CalendarIcon className="size-4" />
          {formatDate(resource.createdAt)}
        </p>
        {resource.rating && <Rating rating={resource.rating} />}
      </CardFooter>
    </Card>
  )
}

function Rating({ rating }: { rating: number }) {
  return (
    <p className="text-muted-foreground flex items-center gap-2 text-xs">
      <StarIcon className="size-4" />
      {rating}
    </p>
  )
}
