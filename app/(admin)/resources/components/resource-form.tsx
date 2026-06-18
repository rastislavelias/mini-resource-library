'use client'
import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { Loader2Icon } from 'lucide-react'

import { createResource, updateResource, type FormState } from '../actions'
import {
  isResourceStatus,
  RESOURCE_STATUSES,
  type ResourceStatusValue,
} from '@/lib/resources/status'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CategoryField } from './category-field'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RatingField } from './rating-field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export type ResourceFormCategory = {
  id: string
  name: string
  color: string
}

type ResourceFormProps =
  | {
      mode: 'create'
      categories: ResourceFormCategory[]
    }
  | {
      mode: 'edit'
      categories: ResourceFormCategory[]
      returnTo: string
      resource: {
        id: string
        title: string
        url: string
        categoryId: string
        status: string
        notes: string | null
        rating: number | null
      }
    }

const initialState: FormState = {
  status: 'idle',
  message: '',
}

export function ResourceForm(props: ResourceFormProps) {
  const isEditMode = props.mode === 'edit'
  const action = isEditMode ? updateResource : createResource

  const [title, setTitle] = useState(isEditMode ? props.resource.title : '')
  const [url, setUrl] = useState(isEditMode ? props.resource.url : '')
  const [categories, setCategories] = useState(props.categories)
  const [categoryId, setCategoryId] = useState(
    isEditMode ? props.resource.categoryId : ''
  )
  const [status, setStatus] = useState<ResourceStatusValue>(
    isEditMode && isResourceStatus(props.resource.status)
      ? props.resource.status
      : 'TO_READ'
  )
  const [notes, setNotes] = useState(isEditMode ? props.resource.notes : '')
  const [rating, setRating] = useState(isEditMode ? props.resource.rating : 0)

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

  function handleCategoryCreated(category: ResourceFormCategory) {
    setCategories((currentCategories) => {
      const alreadyExists = currentCategories.some(
        (currentCategory) => currentCategory.id === category.id
      )

      if (alreadyExists) {
        return currentCategories
      }

      return [...currentCategories, category].sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    })

    setCategoryId(category.id)
  }

  function handleStatusChange(value: string) {
    if (isResourceStatus(value)) {
      setStatus(value)
    }
  }

  const cardTitle = isEditMode ? 'Edit resource' : 'Add resource'
  const buttonLabel = isEditMode ? 'Save changes' : 'Add resource'
  const pendingLabel = isEditMode ? 'Saving' : 'Adding'

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>

      <CardContent>
        <form action={formAction}>
          <FieldGroup>
            {isEditMode && (
              <>
                <input type="hidden" name="id" value={props.resource.id} />
                <input type="hidden" name="returnTo" value={props.returnTo} />
              </>
            )}

            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                autoComplete="off"
                id="title"
                maxLength={100}
                name="title"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. React Hooks"
                required
                type="text"
                value={title}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="url">URL</FieldLabel>
              <Input
                autoComplete="off"
                id="url"
                name="url"
                onChange={(event) => setUrl(event.target.value)}
                placeholder="e.g. https://react.dev"
                required
                type="url"
                value={url}
              />
            </Field>

            <CategoryField
              categoryId={categoryId}
              setCategoryId={setCategoryId}
              categories={categories}
              onCategoryCreated={handleCategoryCreated}
            />

            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Select
                name="status"
                value={status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {RESOURCE_STATUSES.map((statusOption) => (
                      <SelectItem
                        key={statusOption.value}
                        value={statusOption.value}
                      >
                        {statusOption.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <Textarea
                id="notes"
                name="notes"
                value={notes || ''}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="e.g. I found this resource helpful for understanding React Hooks."
              />
            </Field>

            <RatingField value={rating ?? 0} onValueChange={setRating} />

            <Field orientation="horizontal">
              <SubmitButton label={buttonLabel} pendingLabel={pendingLabel} />
            </Field>
          </FieldGroup>
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
          <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </Button>
  )
}
