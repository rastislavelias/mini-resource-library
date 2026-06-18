import type { CategoryColor } from '@/generated/prisma/client'

export type DashboardResource = {
  id: string
  title: string
  url: string
  rating: number | null
  updatedAt: Date
  category: {
    name: string
    color: CategoryColor
  }
}
