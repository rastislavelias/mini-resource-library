import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

import { prisma } from '@/lib/prisma'
import { getResourceCounts } from '@/lib/resources/get-resource-counts'

import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const [resourceCounts, categories] = await Promise.all([
    getResourceCounts(userId),
    prisma.category.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        color: true,
        _count: {
          select: {
            resources: true,
          },
        },
      },
      orderBy: [
        {
          resources: {
            _count: 'desc',
          },
        },
        {
          name: 'asc',
        },
      ],
    }),
  ])

  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 60)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar
          categories={categories}
          resourceCounts={resourceCounts}
          variant="inset"
        />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
