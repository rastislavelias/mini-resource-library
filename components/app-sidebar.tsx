'use client'
import {
  BookOpenIcon,
  LayoutDashboardIcon,
  LibraryBigIcon,
  TagIcon,
} from 'lucide-react'
import {
  IconCircle,
  IconCircleCheck,
  IconCircleDot,
  IconList,
} from '@tabler/icons-react'

import type { ResourceCounts } from '@/lib/resources/counts'

import { NavCategories } from '@/components/nav-categories'
import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { SidebarLink } from '@/components/sidebar-link'

import type { categories } from '@/components/nav-categories'

export function AppSidebar({
  resourceCounts,
  categories,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  resourceCounts: ResourceCounts
  categories: categories
}) {
  const data = {
    navMain: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboardIcon,
      },
      {
        title: 'Resources',
        url: '/resources',
        icon: BookOpenIcon,
        items: [
          {
            title: 'All resources',
            url: '/resources',
            count: resourceCounts.all,
            icon: IconList,
          },
          {
            title: 'To-read',
            url: '/resources/to-read',
            count: resourceCounts.toRead,
            icon: IconCircle,
          },
          {
            title: 'Reading',
            url: '/resources/reading',
            count: resourceCounts.reading,
            icon: IconCircleDot,
          },
          {
            title: 'Finished',
            url: '/resources/finished',
            count: resourceCounts.finished,
            icon: IconCircleCheck,
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: 'Manage categories',
        url: '/categories',
        icon: TagIcon,
      },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="mt-2">
              <SidebarLink href="/dashboard">
                <LibraryBigIcon className="size-5!" />
                <span className="text-sm leading-tight font-medium">
                  Mini Resource Library
                </span>
              </SidebarLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavCategories categories={categories} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
