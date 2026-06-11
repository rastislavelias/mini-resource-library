'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { CategoryColor, Prisma } from '@/generated/prisma/client'

import { prisma } from '@/lib/prisma'
import { isCategoryColor } from '@/lib/category-colors'

export type FormState = {
  status: 'idle' | 'success' | 'error'
  message: string
}

type CategoryInput =
  | {
      ok: true
      name: string
      color: CategoryColor
    }
  | {
      ok: false
      state: FormState
    }

export async function createCategory(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const input = getCategoryInput(formData)

  if (!input.ok) {
    return input.state
  }

  try {
    await prisma.category.create({
      data: {
        name: normalizeCategoryName(input.name),
        color: input.color,
        userId,
      },
    })
  } catch (error) {
    return handleCategoryError(
      error,
      'Could not add category. Please try again.'
    )
  }

  revalidatePath('/categories')
  redirect('/categories?toast=category-created')
}

export async function updateCategory(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const idValue = formData.get('id')

  if (typeof idValue !== 'string' || !idValue) {
    return {
      status: 'error',
      message: 'Category id is missing.',
    }
  }

  const input = getCategoryInput(formData)

  if (!input.ok) {
    return input.state
  }

  let categoryId: string

  try {
    const category = await prisma.category.findFirst({
      where: {
        id: idValue,
        userId,
      },
      select: {
        id: true,
      },
    })

    if (!category) {
      return {
        status: 'error',
        message: 'Category not found.',
      }
    }

    await prisma.category.update({
      where: {
        id: category.id,
      },
      data: {
        name: normalizeCategoryName(input.name),
        color: input.color,
      },
    })

    categoryId = category.id
  } catch (error) {
    return handleCategoryError(
      error,
      'Could not update category. Please try again.'
    )
  }

  revalidatePath('/categories')
  revalidatePath(`/categories/${categoryId}/edit`)
  redirect('/categories?toast=category-updated')
}

export async function deleteCategory(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const idValue = formData.get('id')

  if (typeof idValue !== 'string' || !idValue) {
    return {
      status: 'error',
      message: 'Category id is missing.',
    }
  }

  try {
    const category = await prisma.category.findFirst({
      where: {
        id: idValue,
        userId,
      },
      include: {
        _count: {
          select: {
            resources: true,
          },
        },
      },
    })

    if (!category) {
      return {
        status: 'error',
        message: 'Category not found.',
      }
    }

    if (category._count.resources > 0) {
      return {
        status: 'error',
        message: 'Move or delete resources before deleting this category.',
      }
    }

    await prisma.category.delete({
      where: {
        id: category.id,
      },
    })
  } catch (error) {
    return handleCategoryError(
      error,
      'Could not delete category. Please try again.'
    )
  }

  revalidatePath('/categories')
  redirect('/categories?toast=category-deleted')
}

// Helpers

function getCategoryInput(formData: FormData): CategoryInput {
  const colorValue = formData.get('color')
  const nameValue = formData.get('name')

  if (typeof nameValue !== 'string') {
    return {
      ok: false,
      state: {
        status: 'error',
        message: 'Category name is required.',
      },
    }
  }

  const name = nameValue.trim()

  if (!name) {
    return {
      ok: false,
      state: {
        status: 'error',
        message: 'Category name is required.',
      },
    }
  }

  if (name.length > 40) {
    return {
      ok: false,
      state: {
        status: 'error',
        message: 'Category name must be 40 characters or less.',
      },
    }
  }

  const color: CategoryColor =
    typeof colorValue === 'string' && isCategoryColor(colorValue)
      ? colorValue
      : CategoryColor.SLATE

  return {
    ok: true,
    name,
    color,
  }
}

function handleCategoryError(
  error: unknown,
  fallbackMessage: string
): FormState {
  console.error(error)

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return {
        status: 'error',
        message: 'You already have a category with this name.',
      }
    }

    if (error.code === 'P2003') {
      return {
        status: 'error',
        message: 'Move or delete resources before deleting this category.',
      }
    }
  }

  return {
    status: 'error',
    message: fallbackMessage,
  }
}

function normalizeCategoryName(name: string): string {
  const trimmedName = name.trim().replace(/\s+/g, ' ')

  return trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1)
}
