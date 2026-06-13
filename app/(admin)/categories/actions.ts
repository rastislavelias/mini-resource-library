'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { CategoryColor, Prisma } from '@/generated/prisma/client'

import { prisma } from '@/lib/prisma'
import { categorySchema } from '@/lib/validations/category'

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

export type InlineCategoryState = {
  status: 'idle' | 'success' | 'error'
  message: string
  category?: {
    id: string
    name: string
    color: CategoryColor
  }
}

export async function createInlineCategory(
  _prevState: InlineCategoryState,
  formData: FormData
): Promise<InlineCategoryState> {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const input = getCategoryInput(formData)

  if (!input.ok) {
    return {
      status: 'error',
      message: input.state.message,
    }
  }

  try {
    const category = await prisma.category.create({
      data: {
        name: normalizeCategoryName(input.name),
        color: input.color,
        userId,
      },
      select: {
        id: true,
        name: true,
        color: true,
      },
    })

    revalidatePath('/categories')
    revalidatePath('/resources/add')

    return {
      status: 'success',
      message: 'Category added.',
      category,
    }
  } catch (error) {
    return handleCategoryError(
      error,
      'Could not add category. Please try again.'
    )
  }
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
  const result = categorySchema.safeParse({
    name: formData.get('name'),
    color: formData.get('color'),
  })

  if (!result.success) {
    return {
      ok: false,
      state: {
        status: 'error',
        message: result.error.issues[0]?.message ?? 'Invalid category.',
      },
    }
  }

  return {
    ok: true,
    name: normalizeCategoryName(result.data.name),
    color: result.data.color as CategoryColor,
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
