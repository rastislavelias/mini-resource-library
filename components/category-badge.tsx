import { Badge } from '@/components/ui/badge'

import type { CategoryColor } from '@/generated/prisma/client'

import { CATEGORY_COLORS } from '@/lib/category-colors'

import { cn } from '@/lib/utils'

export function CategoryBadge({
  color,
  name,
}: {
  color: CategoryColor
  name: string
}) {
  return (
    <Badge
      className={cn(
        CATEGORY_COLORS.find((c) => c.value === color)?.badgeClassName
      )}
    >
      {name}
    </Badge>
  )
}
