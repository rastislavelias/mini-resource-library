import type { CategoryWithResources } from './categories-list'

import { formatDate } from '@/lib/format-date'

import { CategoryActions } from './category-actions'
import { CategoryBadge } from '@/components/category-badge'
import { TableCell, TableRow } from '@/components/ui/table'

export function CategoryItem({
  category,
}: {
  category: CategoryWithResources
}) {
  return (
    <TableRow>
      <TableCell>
        <CategoryBadge color={category.color} name={category.name} />
      </TableCell>
      <TableCell className="text-muted-foreground">
        {category._count.resources}{' '}
        {category._count.resources === 1 ? 'resource' : 'resources'}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(category.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <CategoryActions category={category} />
      </TableCell>
    </TableRow>
  )
}
