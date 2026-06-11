import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { CategoriesList } from './components/categories-list'
import { CategoriesToast } from './components/categories-toast'
import { ContainerMain } from '@/components/container-main'
import { SiteHeader } from '@/components/site-header'

export default async function Page() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const categories = await prisma.category.findMany({
    where: {
      userId,
    },
    include: {
      _count: {
        select: {
          resources: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <>
      <SiteHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Categories</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </SiteHeader>
      <ContainerMain>
        <CategoriesList categories={categories} />
        <CategoriesToast />
      </ContainerMain>
    </>
  )
}
