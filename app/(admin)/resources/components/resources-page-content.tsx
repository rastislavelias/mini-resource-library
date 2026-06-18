import { prisma } from '@/lib/prisma'
import { getResources } from '@/lib/resources/get-resources'
import { getValidCategoryId } from '@/lib/resources/get-valid-category-id'
import { parseResourceSearchParams } from '@/lib/resources/query-params'

import { Toolbar } from './toolbar'
import { Pagination } from './pagination'
import { ResourcesEmpty } from './resources-empty'
import { ResourcesList } from './resources-list'

import type { ResourceStatus } from '@/generated/prisma/client'
import type { ResourceSearchParams } from '@/lib/resources/query-params'
import type { ResourceView } from './resources-empty'

type ResourcesPageContentProps = {
  userId: string
  view: ResourceView
  status?: ResourceStatus
  searchParams: ResourceSearchParams
}

export async function ResourcesPageContent({
  userId,
  view,
  status,
  searchParams,
}: ResourcesPageContentProps) {
  const parsedParams = parseResourceSearchParams(searchParams)

  const validCategoryId = await getValidCategoryId({
    categoryId: parsedParams.categoryId,
    userId,
  })

  const hasActiveFilters = Boolean(
    parsedParams.query || parsedParams.categoryId
  )

  const [{ resources, totalCount, totalPages, currentPage }, categories] =
    await Promise.all([
      getResources({
        userId,
        status,
        query: parsedParams.query,
        categoryId: validCategoryId,
        page: parsedParams.page,
      }),
      prisma.category.findMany({
        where: {
          userId,
        },
        orderBy: {
          name: 'asc',
        },
        select: {
          id: true,
          name: true,
          color: true,
        },
      }),
    ])

  return (
    <div className="space-y-6">
      <Toolbar categories={categories} />

      {resources.length === 0 ? (
        <ResourcesEmpty
          view={view}
          hasActiveFilters={hasActiveFilters}
          clearFiltersHref={getResourcesPath(view)}
        />
      ) : (
        <ResourcesList resources={resources} />
      )}

      {totalCount > 0 && (
        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          totalPages={totalPages}
        />
      )}
    </div>
  )
}

function getResourcesPath(view: ResourceView): string {
  switch (view) {
    case 'to-read':
      return '/resources/to-read'
    case 'reading':
      return '/resources/reading'
    case 'finished':
      return '/resources/finished'
    case 'all':
      return '/resources'
  }
}
