import { useRef, useState } from 'react'
import { getCategoryColor } from '@/lib/category-colors'
import { PlusIcon } from 'lucide-react'

import { CreateCategoryDialog } from './create-category-dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { ResourceFormCategory } from './resource-form'

type CategoryFieldProps = {
  categoryId: string
  setCategoryId: (categoryId: string) => void
  categories: ResourceFormCategory[]
  onCategoryCreated: (category: ResourceFormCategory) => void
}

export function CategoryField({
  categoryId,
  setCategoryId,
  categories,
  onCategoryCreated,
}: CategoryFieldProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const selectTriggerRef = useRef<HTMLButtonElement>(null)

  function handleValueChange(value: string) {
    if (value === 'new') {
      setIsCreateDialogOpen(true)
      return
    }

    setCategoryId(value)
  }

  function handleCategoryCreated(category: ResourceFormCategory) {
    onCategoryCreated(category)

    requestAnimationFrame(() => {
      selectTriggerRef.current?.focus()
    })
  }

  return (
    <Field>
      <FieldLabel htmlFor="categoryId">Category</FieldLabel>
      <input type="hidden" name="categoryId" value={categoryId} />
      <Select value={categoryId} onValueChange={handleValueChange} required>
        <SelectTrigger id="categoryId" ref={selectTriggerRef}>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Existing categories</SelectLabel>
            {categories.map((category) => {
              const categoryColor = getCategoryColor(category.color)

              return (
                <SelectItem key={category.id} value={category.id}>
                  <span className="flex items-center gap-2">
                    <span
                      className={`size-2.5 rounded-full ${categoryColor.bulletClassName}`}
                      aria-hidden="true"
                    />
                    {category.name}
                  </span>
                </SelectItem>
              )
            })}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectItem value="new">
              <span className="flex items-center gap-2">
                <PlusIcon className="size-4" aria-hidden="true" />
                Add new category
              </span>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <CreateCategoryDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCategoryCreated={handleCategoryCreated}
      />
    </Field>
  )
}
