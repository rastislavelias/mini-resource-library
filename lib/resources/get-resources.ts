import 'server-only'
import { prisma } from '@/lib/prisma'

import type { Prisma, ResourceStatus } from '@/generated/prisma/client'
import { RESOURCE_PAGE_SIZE } from './constants'

type GetResourcesOptions = {
  userId: string
  status?: ResourceStatus
  query?: string
  categoryId?: string
  page: number
}

export async function getResources({
  userId,
  status,
  query,
  categoryId,
  page,
}: GetResourcesOptions) {
  const where: Prisma.ResourceWhereInput = {
    userId,
    ...(status ? { status } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(query
      ? {
          title: {
            contains: query,
            mode: 'insensitive',
          },
        }
      : {}),
  }

  const totalCount = await prisma.resource.count({
    where,
  })

  const totalPages = Math.max(1, Math.ceil(totalCount / RESOURCE_PAGE_SIZE))

  const currentPage = Math.min(page, totalPages)

  const resources = await prisma.resource.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      url: true,
      status: true,
      rating: true,
      notes: true,
      createdAt: true,
      category: {
        select: {
          name: true,
          color: true,
        },
      },
    },
    skip: (currentPage - 1) * RESOURCE_PAGE_SIZE,
    take: RESOURCE_PAGE_SIZE,
  })

  return {
    resources,
    totalCount,
    totalPages,
    currentPage,
  }
}
