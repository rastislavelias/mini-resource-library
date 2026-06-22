import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'

import { ResourceStatus } from '@/generated/prisma/client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ContainerMain } from '@/components/container-main'
import { ResourcesPageContent } from '../components/resources-page-content'
import { ResourcesToast } from '../components/resources-toast'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Finished',
}

import type { ResourceSearchParams } from '@/lib/resources/query-params'

type PageProps = {
  searchParams: Promise<ResourceSearchParams>
}

export default async function Page({ searchParams }: PageProps) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <>
      <SiteHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden sm:block">
              <BreadcrumbLink asChild>
                <Link href="/resources">Resources</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Finished</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </SiteHeader>
      <ContainerMain>
        <ResourcesPageContent
          userId={userId}
          view="finished"
          status={ResourceStatus.FINISHED}
          searchParams={await searchParams}
        />
        <ResourcesToast />
      </ContainerMain>
    </>
  )
}
