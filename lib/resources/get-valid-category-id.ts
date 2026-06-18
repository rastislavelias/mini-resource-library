import { prisma } from '@/lib/prisma'

export async function getValidCategoryId({
  categoryId,
  userId,
}: {
  categoryId?: string
  userId: string
}): Promise<string | undefined> {
  if (!categoryId) {
    return undefined
  }

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId,
    },
    select: {
      id: true,
    },
  })

  return category?.id
}
