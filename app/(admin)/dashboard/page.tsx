import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

import { ResourceStatus } from '@/generated/prisma/client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { ContainerMain } from '@/components/container-main'
import { SiteHeader } from '@/components/site-header'
import { getResourceCounts } from '@/lib/resources/get-resource-counts'
import { prisma } from '@/lib/prisma'

import { CurrentlyReadingSection } from './components/currently-reading-section'
import { StatusSummary } from './components/status-summary'
import { TopRatedResources } from './components/top-rated-resources'

const dashboardResourceSelect = {
  id: true,
  title: true,
  url: true,
  rating: true,
  updatedAt: true,
  category: {
    select: {
      name: true,
      color: true,
    },
  },
} as const

export default async function Page() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const [resourceCounts, currentlyReading, topRated] = await Promise.all([
    getResourceCounts(userId),
    prisma.resource.findMany({
      where: {
        userId,
        status: ResourceStatus.READING,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: dashboardResourceSelect,
      take: 3,
    }),
    prisma.resource.findMany({
      where: {
        userId,
        rating: {
          gte: 4,
        },
      },
      orderBy: [
        {
          rating: 'desc',
        },
        {
          updatedAt: 'desc',
        },
      ],
      select: dashboardResourceSelect,
      take: 3,
    }),
  ])

  return (
    <>
      <SiteHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </SiteHeader>
      <ContainerMain>
        <div className="space-y-8">
          <StatusSummary resourceCounts={resourceCounts} />

          <CurrentlyReadingSection resources={currentlyReading} />

          <TopRatedResources resources={topRated} />
        </div>
      </ContainerMain>
    </>
  )
}
