'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { createCategory, updateCategory } from '../actions'

import { CATEGORY_COLORS, isCategoryColor } from '@/lib/category-colors'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { FormState } from '../actions'
import type { CategoryColorValue } from '@/lib/category-colors'

type CategoryFormProps =
  | {
      mode: 'create'
    }
  | {
      mode: 'edit'
      category: {
        id: string
        name: string
        color: string
      }
    }

const initialState: FormState = {
  status: 'idle',
  message: '',
}

export function CategoryForm(props: CategoryFormProps) {
  const isEditMode = props.mode === 'edit'
  const action = isEditMode ? updateCategory : createCategory

  const [name, setName] = useState(isEditMode ? props.category.name : '')
  const [color, setColor] = useState<CategoryColorValue>(
    isEditMode && isCategoryColor(props.category.color)
      ? props.category.color
      : 'SLATE'
  )

  const [state, formAction] = useActionState(action, initialState)

  useEffect(() => {
    if (state.status === 'idle') {
      return
    }

    if (state.status === 'error') {
      toast.error(state.message, {
        duration: 5000,
      })
    }
  }, [state])

  function handleColorChange(value: string) {
    if (isCategoryColor(value)) {
      setColor(value)
    }
  }

  const title = isEditMode ? 'Edit category' : 'Add category'
  const buttonLabel = isEditMode ? 'Save changes' : 'Add category'
  const pendingLabel = isEditMode ? 'Saving' : 'Adding'

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-4">
          {isEditMode && (
            <input type="hidden" name="id" value={props.category.id} />
          )}

          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              autoComplete="off"
              id="name"
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
            <FieldLabel htmlFor="color">Color</FieldLabel>
            <Select
              name="color"
              value={color}
              onValueChange={handleColorChange}
            >
              <SelectTrigger id="color" className="w-full">
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

          <SubmitButton label={buttonLabel} pendingLabel={pendingLabel} />
        </form>
      </CardContent>
    </Card>
  )
}

function SubmitButton({
  label,
  pendingLabel,
}: {
  label: string
  pendingLabel: string
}) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </Button>
  )
}
