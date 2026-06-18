'use client'
import { useState, useTransition } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { EllipsisVerticalIcon, Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'

import { updateResourceStatus } from '../actions'
import { RESOURCE_STATUSES, isResourceStatus } from '@/lib/resources/status'

import type { ResourceStatusValue } from '@/lib/resources/status'
import type { Resource } from './resource-item'

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

export function ResourceActions({ resource }: { resource: Resource }) {
  const [status, setStatus] = useState<ResourceStatusValue>(resource.status)
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const queryString = searchParams.toString()
  const returnTo = queryString ? `${pathname}?${queryString}` : pathname

  const editHref = `/resources/${resource.id}/edit?${new URLSearchParams({
    returnTo,
  }).toString()}`

  function handleStatusChange(value: string) {
    if (!isResourceStatus(value) || value === status) {
      return
    }

    const previousStatus = status

    // Optimistically update the displayed selection.
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
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
