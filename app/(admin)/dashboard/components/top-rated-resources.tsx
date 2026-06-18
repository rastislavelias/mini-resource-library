import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card'
import { DashboardResourceCard } from './dashboard-resource-card'

import type { DashboardResource } from './dashboard-types'

export function TopRatedResources({
  resources,
}: {
  resources: DashboardResource[]
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-medium">Top rated</h2>
          <p className="text-muted-foreground text-sm">
            Resources you rated 4 or 5 stars.
          </p>
        </div>

        <Link
          href="/resources"
          className="text-muted-foreground hover:text-foreground text-sm font-medium"
        >
          View all
        </Link>
      </div>

      {resources.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {resources.map((resource) => (
            <DashboardResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              No highly rated resources yet.
            </p>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
