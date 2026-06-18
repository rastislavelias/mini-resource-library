export type ResourceSearchParams = {
  q?: string
  category?: string
  page?: string
}

export type ParsedResourceSearchParams = {
  query?: string
  categoryId?: string
  page: number
}

export function parseResourceSearchParams(
  searchParams: ResourceSearchParams
): ParsedResourceSearchParams {
  const query = searchParams.q?.trim() || undefined
  const categoryId = searchParams.category?.trim() || undefined
  const page = parsePage(searchParams.page)

  return {
    query,
    categoryId,
    page,
  }
}

function parsePage(value: string | undefined): number {
  if (!value) {
    return 1
  }

  const page = Number(value)

  if (!Number.isInteger(page) || page < 1) {
    return 1
  }

  return page
}
