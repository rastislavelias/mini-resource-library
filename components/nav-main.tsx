'use client'
import { usePathname } from 'next/navigation'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { IconCirclePlusFilled } from '@tabler/icons-react'

import { type ResourceStatusValue } from '@/lib/resources/status'

import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar'
import { SidebarLink } from '@/components/sidebar-link'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    items?: {
      title: string
      url: string
      count?: number
      status?: ResourceStatusValue
      icon?: LucideIcon
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu className="pb-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Add Resource"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8"
                asChild
              >
                <SidebarLink href="/resources/add">
                  <IconCirclePlusFilled />
                  Add Resource
                </SidebarLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu className="space-y-1">
            {items.map((item) => {
              if (item.items) {
                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={pathname.startsWith(item.url)}
                        >
                          {item.icon && <item.icon />}
                          {item.title}
                          <ChevronRight className="me-1 ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-0.5">
                        <SidebarMenuSub className="me-0 pe-0">
                          {item.items?.map((subItem) => {
                            const isActive = pathname === subItem.url

                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive}
                                >
                                  <SidebarLink href={subItem.url}>
                                    {subItem.icon && <subItem.icon />}
                                    <span>{subItem.title}</span>
                                    <Badge
                                      variant="outline"
                                      className="text-muted-foreground ml-auto"
                                    >
                                      {subItem.count}
                                    </Badge>
                                  </SidebarLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              } else {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={pathname.startsWith(item.url)}
                      tooltip={item.title}
                      asChild
                    >
                      <SidebarLink href={item.url}>
                        {item.icon && <item.icon />}
                        {item.title}
                      </SidebarLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              }
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}
