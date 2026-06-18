import 'server-only'

import { prisma } from '@/lib/prisma'

import type { ResourceCounts } from './counts'

export async function getResourceCounts(
  userId: string
): Promise<ResourceCounts> {
  const groups = await prisma.resource.groupBy({
    by: ['status'],
    where: {
      userId,
    },
    _count: {
      _all: true,
    },
  })

  const counts: ResourceCounts = {
    all: 0,
    toRead: 0,
    reading: 0,
    finished: 0,
  }

  for (const group of groups) {
    const count = group._count._all

    counts.all += count

    switch (group.status) {
      case 'TO_READ':
        counts.toRead = count
        break
      case 'READING':
        counts.reading = count
        break
      case 'FINISHED':
        counts.finished = count
        break
    }
  }

  return counts
}
