import { ResourceItem } from './resource-item'

// import type { Resource } from '@/generated/prisma/client'

import type { Resource } from './resource-item'

export function ResourcesList({ resources }: { resources: Resource[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource) => (
        <ResourceItem key={resource.id} resource={resource} />
      ))}
    </div>
  )
}
