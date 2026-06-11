import Link from 'next/link'
import { ListIcon } from 'lucide-react'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { buttonVariants } from '@/components/ui/button'
import { CategoryItem } from './category-item'

import type { Category } from '@/generated/prisma/client'
export type CategoryWithResources = Category & {
  _count: {
    resources: number
  }
}

export function CategoriesList({
  categories,
}: {
  categories: CategoryWithResources[]
}) {
  if (categories.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ListIcon />
          </EmptyMedia>
          <EmptyTitle>No Categories Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any categories yet. Get started by adding
            your first category.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link
            href="/categories/add"
            className={buttonVariants({ variant: 'default' })}
          >
            Add Category
          </Link>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Categories are used to group resources.
        </CardDescription>
        <CardAction>
          <Link
            href="/categories/add"
            className={buttonVariants({ variant: 'default' })}
          >
            Add Category
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Resources</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="sr-only text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <CategoryItem key={category.id} category={category} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
