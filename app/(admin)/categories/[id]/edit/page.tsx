import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { CategoryForm } from '../../components/category-form'
import { ContainerMain } from '@/components/container-main'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Edit Category',
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [{ id }, { userId }] = await Promise.all([params, auth()])

  if (!userId) {
    redirect('/sign-in')
  }

  const category = await prisma.category.findUnique({
    where: { id, userId },
    select: {
      id: true,
      name: true,
      color: true,
    },
  })

  if (!category) {
    notFound()
  }

  return (
    <>
      <SiteHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden sm:block">
              <BreadcrumbLink asChild>
                <Link href="/categories">Categories</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:block" />
            <BreadcrumbItem className="hidden sm:block lg:hidden">
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbItem className="hidden min-w-0 lg:block">
              <BreadcrumbPage className="text-muted-foreground block max-w-42 truncate">
                {category.name}
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
        <CategoryForm mode="edit" category={category} />
      </ContainerMain>
    </>
  )
}
