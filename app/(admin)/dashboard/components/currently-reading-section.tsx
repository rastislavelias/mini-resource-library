import { CurrentlyReadingTable } from './currently-reading-table'

import type { DashboardResource } from './dashboard-types'

export function CurrentlyReadingSection({
  resources,
}: {
  resources: DashboardResource[]
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-heading text-lg font-medium">
          Currently reading
        </h2>
        <p className="text-muted-foreground text-sm">
          Recently updated resources you are working through.
        </p>
      </div>

      <CurrentlyReadingTable resources={resources} />
    </section>
  )
}
