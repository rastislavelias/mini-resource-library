export const CATEGORY_COLORS = [
  {
    value: 'BLUE',
    label: 'Blue',
    bulletClassName: 'bg-blue-500',
    badgeClassName:
      'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  },
  {
    value: 'GREEN',
    label: 'Green',
    bulletClassName: 'bg-green-500',
    badgeClassName:
      'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  },
  {
    value: 'ORANGE',
    label: 'Orange',
    bulletClassName: 'bg-orange-500',
    badgeClassName:
      'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  },
  {
    value: 'PINK',
    label: 'Pink',
    bulletClassName: 'bg-pink-500',
    badgeClassName:
      'bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
  },
  {
    value: 'PURPLE',
    label: 'Purple',
    bulletClassName: 'bg-purple-500',
    badgeClassName:
      'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  },
  {
    value: 'RED',
    label: 'Red',
    bulletClassName: 'bg-red-500',
    badgeClassName: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
  },
  {
    value: 'SLATE',
    label: 'Slate',
    bulletClassName: 'bg-slate-500',
    badgeClassName:
      'bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300',
  },
  {
    value: 'YELLOW',
    label: 'Yellow',
    bulletClassName: 'bg-yellow-500',
    badgeClassName:
      'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
  },
] as const

export type CategoryColorValue = (typeof CATEGORY_COLORS)[number]['value']

export function isCategoryColor(value: string): value is CategoryColorValue {
  return CATEGORY_COLORS.some((color) => color.value === value)
}

export function getCategoryColor(value: string) {
  return (
    CATEGORY_COLORS.find((color) => color.value === value) ?? CATEGORY_COLORS[0]
  )
}
