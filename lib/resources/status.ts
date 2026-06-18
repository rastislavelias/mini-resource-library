export const RESOURCE_STATUSES = [
  {
    value: 'TO_READ',
    label: 'To read',
  },
  {
    value: 'READING',
    label: 'Reading',
  },
  {
    value: 'FINISHED',
    label: 'Finished',
  },
] as const

export type ResourceStatusValue = (typeof RESOURCE_STATUSES)[number]['value']

export function isResourceStatus(value: string): value is ResourceStatusValue {
  return RESOURCE_STATUSES.some((status) => status.value === value)
}

export function getResourceStatus(value: string) {
  return (
    RESOURCE_STATUSES.find((status) => status.value === value) ??
    RESOURCE_STATUSES[0]
  )
}
