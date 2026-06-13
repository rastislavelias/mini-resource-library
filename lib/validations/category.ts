import { z } from 'zod'

import { CATEGORY_COLORS } from '@/lib/category-colors'

const categoryColorValues = CATEGORY_COLORS.map((color) => color.value) as [
  string,
  ...string[],
]

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Category name is required.')
    .max(40, 'Category name must be 40 characters or less.')
    .transform((name) => name.replace(/\s+/g, ' ')),
  color: z.enum(categoryColorValues, {
    message: 'Select a valid category color.',
  }),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
