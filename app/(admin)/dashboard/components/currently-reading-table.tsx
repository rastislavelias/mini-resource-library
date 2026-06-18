import { ExternalLinkIcon, StarIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CategoryBadge } from '@/components/category-badge'
import { formatDate } from '@/lib/format-date'

import type { DashboardResource } from './dashboard-types'

export function CurrentlyReadingTable({
  resources,
}: {
  resources: DashboardResource[]
}) {
  if (resources.length === 0) {
    return (
      <Card>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Nothing is marked as reading yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden py-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Resource</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden sm:table-cell">Rating</TableHead>
            <TableHead className="hidden lg:table-cell">Updated</TableHead>
            <TableHead className="text-right">Open</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {resources.map((resource) => (
            <TableRow key={resource.id}>
              <TableCell className="min-w-0">
                <div className="max-w-md space-y-1">
                  <p className="truncate font-medium">{resource.title}</p>
                  <p className="text-muted-foreground truncate text-sm">
                    {resource.url}
                  </p>
                </div>
              </TableCell>

              <TableCell className="hidden md:table-cell">
                <CategoryBadge
                  color={resource.category.color}
                  name={resource.category.name}
                />
              </TableCell>

              <TableCell className="hidden sm:table-cell">
                {resource.rating !== null ? (
                  <Badge
                    variant="outline"
                    className="text-muted-foreground gap-1"
                  >
                    <StarIcon
                      className="size-3 fill-current text-yellow-500"
                      aria-hidden="true"
                    />
                    {resource.rating}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>

              <TableCell className="text-muted-foreground hidden whitespace-nowrap lg:table-cell">
                {formatDate(resource.updatedAt)}
              </TableCell>

              <TableCell className="text-right">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground focus-visible:outline-ring inline-flex items-center gap-1 rounded-sm text-sm underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Open
                  <ExternalLinkIcon className="size-4" aria-hidden="true" />
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
