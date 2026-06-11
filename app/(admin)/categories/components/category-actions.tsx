'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import {
  EllipsisVerticalIcon,
  Loader2Icon,
  PencilIcon,
  TrashIcon,
} from 'lucide-react'
import { toast } from 'sonner'

import { deleteCategory } from '../actions'

import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type { FormState } from '../actions'
import type { CategoryWithResources } from './categories-list'

const initialState: FormState = {
  status: 'idle',
  message: '',
}

export function CategoryActions({
  category,
}: {
  category: CategoryWithResources
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [state, formAction] = useActionState(deleteCategory, initialState)

  const resourceCount = category._count.resources
  const canDelete = resourceCount === 0

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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Open category menu"
          >
            <EllipsisVerticalIcon aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/categories/${category.id}/edit`}>
              <PencilIcon className="size-4" aria-hidden="true" />
              <span>Edit</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="destructive"
            onSelect={(event) => {
              event.preventDefault()
              setIsDeleteDialogOpen(true)
            }}
          >
            <TrashIcon className="size-4" aria-hidden="true" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {canDelete ? 'Delete category?' : 'Category cannot be deleted'}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {canDelete
                ? `This will permanently delete “${category.name}”. This action cannot be undone.`
                : `“${category.name}” has ${resourceCount} ${
                    resourceCount === 1 ? 'resource' : 'resources'
                  }. Move or delete linked resources before deleting this category.`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {canDelete ? (
            <form action={formAction}>
              <input type="hidden" name="id" value={category.id} />

              <AlertDialogFooter>
                <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                <DeleteSubmitButton />
              </AlertDialogFooter>
            </form>
          ) : (
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function DeleteSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      {pending ? (
        <>
          <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />
          Deleting
        </>
      ) : (
        'Delete'
      )}
    </Button>
  )
}
