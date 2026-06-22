import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { ContainerMain } from '@/components/container-main'
import { ResourcesPageContent } from './components/resources-page-content'
import { ResourcesToast } from './components/resources-toast'
import { SiteHeader } from '@/components/site-header'

import type { ResourceSearchParams } from '@/lib/resources/query-params'

export const metadata: Metadata = {
  title: 'Resources',
}

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
            <BreadcrumbItem>
              <BreadcrumbPage>Resources</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </SiteHeader>
      <ContainerMain>
        <ResourcesPageContent
          userId={userId}
          view="all"
          searchParams={await searchParams}
        />
        <ResourcesToast />
      </ContainerMain>
    </>
  )
}
