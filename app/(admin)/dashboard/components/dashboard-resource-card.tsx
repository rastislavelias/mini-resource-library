import { ExternalLinkIcon, StarIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CategoryBadge } from '@/components/category-badge'
import { formatDate } from '@/lib/format-date'

import type { DashboardResource } from './dashboard-types'

export function DashboardResourceCard({
  resource,
}: {
  resource: DashboardResource
}) {
  return (
    <Card className="group hover:bg-muted/40 relative h-full overflow-hidden transition-colors">
      <div
        className="bg-background absolute top-4 right-4 flex size-10 items-center justify-center rounded-full border text-yellow-500"
        aria-label={
          resource.rating ? `Rated ${resource.rating} out of 5` : 'Not rated'
        }
      >
        <StarIcon className="size-4 fill-current" aria-hidden="true" />
      </div>

      <CardHeader className="space-y-4 pr-16">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge
            color={resource.category.color}
            name={resource.category.name}
          />

          {resource.rating !== null && (
            <Badge variant="outline" className="text-muted-foreground gap-1">
              {resource.rating}/5
            </Badge>
          )}
        </div>

        <div className="space-y-1.5">
          <CardTitle className="line-clamp-2 text-base">
            {resource.title}
          </CardTitle>

          <CardDescription>
            Updated {formatDate(resource.updatedAt)}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground focus-visible:outline-ring inline-flex max-w-full items-center gap-1 rounded-sm text-sm font-medium underline underline-offset-4 transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span className="truncate">Open resource</span>
          <ExternalLinkIcon
            className="size-4 flex-none transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </a>
      </CardContent>
    </Card>
  )
}
