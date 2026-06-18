'use client'
import { useActionState, useEffect, useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { EllipsisVerticalIcon, Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'

import { deleteResource, updateResourceStatus } from '../actions'
import { RESOURCE_STATUSES, isResourceStatus } from '@/lib/resources/status'

import type { FormState } from '../actions'
import type { ResourceStatusValue } from '@/lib/resources/status'
import type { Resource } from './resource-item'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const initialDeleteState: FormState = {
  status: 'idle',
  message: '',
}

export function ResourceActions({ resource }: { resource: Resource }) {
  const [status, setStatus] = useState<ResourceStatusValue>(resource.status)
  const [isPending, startTransition] = useTransition()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteState, deleteAction] = useActionState(
    deleteResource,
    initialDeleteState
  )
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const queryString = searchParams.toString()
  const returnTo = queryString ? `${pathname}?${queryString}` : pathname

  const editHref = `/resources/${resource.id}/edit?${new URLSearchParams({
    returnTo,
  }).toString()}`

  useEffect(() => {
    if (deleteState.status === 'idle') {
      return
    }

    if (deleteState.status === 'error') {
      toast.error(deleteState.message, {
        duration: 5000,
      })
    }
  }, [deleteState])

  function handleStatusChange(value: string) {
    if (!isResourceStatus(value) || value === status) {
      return
    }

    const previousStatus = status

    setStatus(value)

    startTransition(async () => {
      const result = await updateResourceStatus(resource.id, value)

      if (result.status === 'error') {
        setStatus(previousStatus)

        toast.error(result.message, {
          duration: 5000,
        })

        return
      }

      toast.success(result.message)
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open resource menu"
            disabled={isPending}
            size="icon-sm"
            variant="ghost"
          >
            {isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <EllipsisVerticalIcon />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={status}
              onValueChange={handleStatusChange}
            >
              {RESOURCE_STATUSES.map((statusOption) => (
                <DropdownMenuRadioItem
                  key={statusOption.value}
                  value={statusOption.value}
                  disabled={isPending}
                >
                  {statusOption.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={editHref}>Edit</Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              variant="destructive"
              onSelect={(event) => {
                event.preventDefault()
                setIsDeleteDialogOpen(true)
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete resource?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete “{resource.title}”. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <form action={deleteAction}>
              <input type="hidden" name="id" value={resource.id} />
              <input type="hidden" name="returnTo" value={returnTo} />

              <DeleteSubmitButton />
            </form>
          </AlertDialogFooter>
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
        'Delete resource'
      )}
    </Button>
  )
}
