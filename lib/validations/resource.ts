import { z } from 'zod'

import { RESOURCE_STATUSES } from '@/lib/resources/status'

const resourceStatusValues = RESOURCE_STATUSES.map(
  (status) => status.value
) as [string, ...string[]]

export const resourceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(100, 'Title must be 100 characters or less.'),
  url: z.url('Enter a valid URL.'),
  categoryId: z.string().min(1, 'Select a category.'),
  status: z.enum(resourceStatusValues, {
    message: 'Select a resource status.',
  }),
  notes: z.string().optional(),
  rating: z.preprocess((value) => {
    if (value === '' || value === null) {
      return null
    }

    return Number(value)
  }, z.number().int().min(1).max(5).nullable()),
})

export type ResourceFormValues = z.infer<typeof resourceSchema>
