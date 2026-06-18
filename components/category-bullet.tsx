import type { CategoryColor } from '@/generated/prisma/client'

import { CATEGORY_COLORS } from '@/lib/category-colors'

export function CategoryBullet({ color }: { color: CategoryColor }) {
  return (
    <span
      className={`block size-2 rounded-full ${CATEGORY_COLORS.find((c) => c.value === color)?.bulletClassName}`}
    />
  )
}
