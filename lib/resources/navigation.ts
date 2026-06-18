export const RESOURCE_RETURN_PATHS = [
  '/resources',
  '/resources/to-read',
  '/resources/reading',
  '/resources/finished',
] as const

export function getSafeResourceReturnPath(value: string | undefined): string {
  if (!value) {
    return '/resources'
  }

  try {
    const url = new URL(value, 'http://localhost')

    const isAllowedPath = RESOURCE_RETURN_PATHS.includes(
      url.pathname as (typeof RESOURCE_RETURN_PATHS)[number]
    )

    if (!isAllowedPath) {
      return '/resources'
    }

    return `${url.pathname}${url.search}`
  } catch {
    return '/resources'
  }
}
