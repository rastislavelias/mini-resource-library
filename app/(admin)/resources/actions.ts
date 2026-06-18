'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

import { prisma } from '@/lib/prisma'
import { resourceSchema } from '@/lib/validations/resource'
import { ResourceStatus } from '@/generated/prisma/client'
import { isResourceStatus } from '@/lib/resources/status'
import { getSafeResourceReturnPath } from '@/lib/resources/navigation'

export type FormState = {
  status: 'idle' | 'success' | 'error'
  message: string
}

type ResourceInput =
  | {
      ok: true
      title: string
      url: string
      categoryId: string
      status: ResourceStatus
      notes: string | null
      rating: number | null
    }
  | {
      ok: false
      state: FormState
    }

export async function createResource(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const input = getResourceInput(formData)

  if (!input.ok) {
    return input.state
  }

  try {
    const category = await prisma.category.findFirst({
      where: {
        id: input.categoryId,
        userId,
      },
      select: {
        id: true,
      },
    })

    if (!category) {
      return {
        status: 'error',
        message: 'Select a valid category.',
      }
    }

    await prisma.resource.create({
      data: {
        title: capitalizeResourceTitle(input.title),
        url: input.url,
        userId,
        categoryId: category.id,
        status: input.status,
        notes: input.notes,
        rating: input.rating,
      },
    })
  } catch (error) {
    return handleResourceError(
      error,
      'Could not add resource. Please try again.'
    )
  }

  revalidateResourcePaths()
  redirect('/resources?toast=resource-created')
}

export async function updateResource(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const idValue = formData.get('id')
  const returnToValue = formData.get('returnTo')

  if (typeof idValue !== 'string' || !idValue) {
    return {
      status: 'error',
      message: 'Resource id is missing.',
    }
  }

  const input = getResourceInput(formData)

  if (!input.ok) {
    return input.state
  }

  const returnTo = getSafeResourceReturnPath(
    typeof returnToValue === 'string' ? returnToValue : undefined
  )

  let resourceId: string
  let statusChanged = false

  try {
    const [resource, category] = await Promise.all([
      prisma.resource.findFirst({
        where: {
          id: idValue,
          userId,
        },
        select: {
          id: true,
          status: true,
        },
      }),
      prisma.category.findFirst({
        where: {
          id: input.categoryId,
          userId,
        },
        select: {
          id: true,
        },
      }),
    ])

    if (!resource) {
      return {
        status: 'error',
        message: 'Resource not found.',
      }
    }

    if (!category) {
      return {
        status: 'error',
        message: 'Select a valid category.',
      }
    }

    statusChanged = resource.status !== input.status

    await prisma.resource.update({
      where: {
        id: resource.id,
      },
      data: {
        title: capitalizeResourceTitle(input.title),
        url: input.url,
        categoryId: category.id,
        status: input.status,
        notes: input.notes,
        rating: input.rating,
      },
    })

    resourceId = resource.id
  } catch (error) {
    return handleResourceError(
      error,
      'Could not update resource. Please try again.'
    )
  }

  revalidateResourcePaths()
  revalidatePath(`/resources/${resourceId}/edit`)

  const redirectParams = new URLSearchParams()

  if (statusChanged) {
    redirectParams.set('toast', 'resource-moved')
    redirectParams.set('movedTo', input.status)
  } else {
    redirectParams.set('toast', 'resource-updated')
  }

  redirect(addSearchParams(returnTo, redirectParams))
}

export async function updateResourceStatus(
  resourceId: string,
  statusValue: string
): Promise<FormState> {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  if (!isResourceStatus(statusValue)) {
    return {
      status: 'error',
      message: 'Select a valid resource status.',
    }
  }

  const status: ResourceStatus = statusValue

  try {
    const resource = await prisma.resource.findFirst({
      where: {
        id: resourceId,
        userId,
      },
      select: {
        id: true,
      },
    })

    if (!resource) {
      return {
        status: 'error',
        message: 'Resource not found.',
      }
    }

    await prisma.resource.update({
      where: {
        id: resource.id,
      },
      data: {
        status,
      },
    })
  } catch (error) {
    return handleResourceError(
      error,
      'Could not update resource status. Please try again.'
    )
  }

  revalidateResourcePaths()

  return {
    status: 'success',
    message: 'Resource status updated.',
  }
}

export async function deleteResource(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const idValue = formData.get('id')
  const returnToValue = formData.get('returnTo')

  if (typeof idValue !== 'string' || !idValue) {
    return {
      status: 'error',
      message: 'Resource id is missing.',
    }
  }

  const returnTo = getSafeResourceReturnPath(
    typeof returnToValue === 'string' ? returnToValue : undefined
  )

  try {
    const resource = await prisma.resource.findFirst({
      where: {
        id: idValue,
        userId,
      },
      select: {
        id: true,
      },
    })

    if (!resource) {
      return {
        status: 'error',
        message: 'Resource not found.',
      }
    }

    await prisma.resource.delete({
      where: {
        id: resource.id,
      },
    })
  } catch (error) {
    return handleResourceError(
      error,
      'Could not delete resource. Please try again.'
    )
  }

  revalidateResourcePaths()

  const redirectParams = new URLSearchParams()
  redirectParams.set('toast', 'resource-deleted')

  redirect(addSearchParams(returnTo, redirectParams))
}

// Helpers

function getResourceInput(formData: FormData): ResourceInput {
  const result = resourceSchema.safeParse({
    title: formData.get('title'),
    url: formData.get('url'),
    categoryId: formData.get('categoryId'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    rating: formData.get('rating'),
  })

  if (!result.success) {
    return {
      ok: false,
      state: {
        status: 'error',
        message: result.error.issues[0]?.message ?? 'Invalid resource.',
      },
    }
  }

  return {
    ok: true,
    title: result.data.title,
    url: result.data.url,
    categoryId: result.data.categoryId,
    status: result.data.status as ResourceStatus,
    notes: result.data.notes ?? null,
    rating: result.data.rating ?? null,
  }
}

function handleResourceError(
  error: unknown,
  fallbackMessage: string
): FormState {
  console.error(error)

  return {
    status: 'error',
    message: fallbackMessage,
  }
}

function capitalizeResourceTitle(title: string): string {
  return title.charAt(0).toUpperCase() + title.slice(1)
}

function revalidateResourcePaths(): void {
  revalidatePath('/resources')
  revalidatePath('/resources/to-read')
  revalidatePath('/resources/reading')
  revalidatePath('/resources/finished')
  revalidatePath('/(admin)', 'layout')
}

function addSearchParams(path: string, newParams: URLSearchParams): string {
  const url = new URL(path, 'http://localhost')

  newParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })

  return `${url.pathname}${url.search}`
}
