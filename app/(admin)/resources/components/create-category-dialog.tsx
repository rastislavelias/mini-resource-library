'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'

import { createInlineCategory } from '@/app/(admin)/categories/actions'
import { CATEGORY_COLORS, isCategoryColor } from '@/lib/category-colors'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { InlineCategoryState } from '@/app/(admin)/categories/actions'
import type { CategoryColorValue } from '@/lib/category-colors'
import type { ResourceFormCategory } from './resource-form'

const initialState: InlineCategoryState = {
  status: 'idle',
  message: '',
}

type CreateCategoryDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCategoryCreated: (category: ResourceFormCategory) => void
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
  onCategoryCreated,
}: CreateCategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add category</DialogTitle>
            <DialogDescription>
              Create a category without leaving the resource form.
            </DialogDescription>
          </DialogHeader>

          <CreateCategoryForm
            onCancel={() => onOpenChange(false)}
            onSuccess={(category) => {
              onCategoryCreated(category)
              onOpenChange(false)
            }}
          />
        </DialogContent>
      )}
    </Dialog>
  )
}

function CreateCategoryForm({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void
  onSuccess: (category: ResourceFormCategory) => void
}) {
  const [name, setName] = useState('')
  const [color, setColor] = useState<CategoryColorValue>('SLATE')
  const [state, formAction] = useActionState(createInlineCategory, initialState)

  const handledStateRef = useRef<string | null>(null)

  useEffect(() => {
    if (state.status === 'idle') {
      return
    }

    const stateKey =
      state.status === 'success' && state.category
        ? `success-${state.category.id}`
        : `error-${state.message}`

    if (handledStateRef.current === stateKey) {
      return
    }

    handledStateRef.current = stateKey

    if (state.status === 'success' && state.category) {
      toast.success(state.message)

      onSuccess({
        id: state.category.id,
        name: state.category.name,
        color: state.category.color,
      })

      return
    }

    if (state.status === 'error') {
      toast.error(state.message, {
        duration: 5000,
      })
    }
  }, [state, onSuccess])

  function handleColorChange(value: string) {
    if (isCategoryColor(value)) {
      setColor(value)
    }
  }

  return (
    <form action={formAction}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="inline-category-name">Name</FieldLabel>
          <Input
            autoComplete="off"
            id="inline-category-name"
            maxLength={40}
            name="name"
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Frontend, Backend, TypeScript"
            required
            type="text"
            value={name}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="inline-category-color">Color</FieldLabel>

          <Select name="color" value={color} onValueChange={handleColorChange}>
            <SelectTrigger id="inline-category-color">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>

            <SelectContent>
              {CATEGORY_COLORS.map((colorOption) => (
                <SelectItem key={colorOption.value} value={colorOption.value}>
                  <span className="flex items-center gap-2">
                    <span
                      className={`size-2.5 rounded-full ${colorOption.bulletClassName}`}
                      aria-hidden="true"
                    />
                    {colorOption.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <SubmitButton />
        </div>
      </FieldGroup>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />
          Adding
        </>
      ) : (
        'Add category'
      )}
    </Button>
  )
}
