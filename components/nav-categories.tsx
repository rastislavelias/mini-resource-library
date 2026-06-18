'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { MoreHorizontalIcon } from 'lucide-react'

import type { CategoryColor } from '@/generated/prisma/client'

import { Badge } from '@/components/ui/badge'
import { CategoryBullet } from '@/components/category-bullet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { SidebarLink } from '@/components/sidebar-link'

export type categories = {
  id: string
  name: string
  color: CategoryColor
  _count: {
    resources: number
  }
}[]

const VISIBLE_CATEGORY_COUNT = 4

export function NavCategories({ categories }: { categories: categories }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isMobile } = useSidebar()

  const selectedCategoryId = searchParams.get('category')

  const populatedCategories = categories.filter(
    (category) => category._count.resources > 0
  )

  const visibleCategories = populatedCategories.slice(0, VISIBLE_CATEGORY_COUNT)

  const remainingCategories = populatedCategories.slice(VISIBLE_CATEGORY_COUNT)

  if (populatedCategories.length === 0) {
    return null
  }

  function isCategoryActive(categoryId: string): boolean {
    return pathname === '/resources' && selectedCategoryId === categoryId
  }

  function getCategoryHref(categoryId: string): string {
    const params = new URLSearchParams()

    params.set('category', categoryId)

    return `/resources?${params.toString()}`
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Filter by categories</SidebarGroupLabel>
      <SidebarMenu className="space-y-1">
        {visibleCategories.map((category) => (
          <SidebarMenuItem key={category.id}>
            <SidebarMenuButton asChild isActive={isCategoryActive(category.id)}>
              <SidebarLink href={getCategoryHref(category.id)}>
                <CategoryBullet color={category.color} />
                <span className="truncate">{category.name}</span>
                <Badge
                  variant="outline"
                  className="text-muted-foreground ml-auto"
                >
                  {category._count.resources}
                </Badge>
              </SidebarLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        {remainingCategories.length > 0 && (
          <DropdownMenu>
            <SidebarMenuItem>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="text-sidebar-foreground/70 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  More categories
                  <MoreHorizontalIcon className="text-sidebar-foreground/70 me-1 ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
                className="min-w-56 space-y-1 rounded-lg"
              >
                {remainingCategories.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <SidebarLink href={getCategoryHref(category.id)}>
                      <CategoryBullet color={category.color} />

                      <span className="min-w-0 flex-1 truncate">
                        {category.name}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-muted-foreground ml-auto"
                      >
                        {category._count.resources}
                      </Badge>
                    </SidebarLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </SidebarMenuItem>
          </DropdownMenu>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
