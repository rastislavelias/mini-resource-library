import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

import { getSafeResourceReturnPath } from '@/lib/resources/navigation'

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ResourceForm } from '../../components/resource-form'
import { ContainerMain } from '@/components/container-main'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Edit Resource',
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ returnTo?: string }>
}) {
  const [{ id }, { userId }, { returnTo }] = await Promise.all([
    params,
    auth(),
    searchParams,
  ])

  if (!userId) {
    redirect('/sign-in')
  }

  const [resource, categories] = await Promise.all([
    prisma.resource.findUnique({
      where: { id, userId },
      select: {
        id: true,
        title: true,
        url: true,
        categoryId: true,
        status: true,
        notes: true,
        rating: true,
      },
    }),
    prisma.category.findMany({
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
    }),
  ])

  if (!resource) {
    notFound()
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
            <BreadcrumbItem className="hidden sm:block lg:hidden">
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbItem className="hidden min-w-0 lg:block">
              <BreadcrumbPage className="text-muted-foreground block max-w-42 truncate">
                {resource.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </SiteHeader>
      <ContainerMain>
        <ResourceForm
          mode="edit"
          categories={categories}
          resource={resource}
          returnTo={getSafeResourceReturnPath(returnTo)}
        />
      </ContainerMain>
    </>
  )
}
