import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'

import { prisma } from '@/lib/prisma'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ContainerMain } from '@/components/container-main'
import { ResourceForm } from '../components/resource-form'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Add Resource',
}

export default async function Page() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const categories = await prisma.category.findMany({
    where: {
      userId,
    },
    orderBy: {
      name: 'asc',
    },
    select: {
      id: true,
      name: true,
      color: true,
    },
  })

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
              <BreadcrumbPage>Add</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </SiteHeader>
      <ContainerMain>
        <ResourceForm mode="create" categories={categories} />
      </ContainerMain>
    </>
  )
}
