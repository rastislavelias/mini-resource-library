import { config } from 'dotenv'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

import {
  CategoryColor,
  PrismaClient,
  ResourceStatus,
} from '../generated/prisma/client'

config({
  path: '.env.local',
})

function getEnv(name: string): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing ${name} in environment variables.`)
  }

  return value
}

const databaseUrl = getEnv('DATABASE_URL')
const seedUserId = getEnv('SEED_USER_ID')

const pool = new Pool({
  connectionString: databaseUrl,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const categories = [
  {
    name: 'Frontend',
    color: CategoryColor.BLUE,
  },
  {
    name: 'Backend',
    color: CategoryColor.GREEN,
  },
  {
    name: 'JavaScript',
    color: CategoryColor.YELLOW,
  },
  {
    name: 'TypeScript',
    color: CategoryColor.PURPLE,
  },
  {
    name: 'Design',
    color: CategoryColor.PINK,
  },
] as const

const resources = [
  {
    title: 'React Documentation',
    url: 'https://react.dev',
    notes:
      'Official React documentation with guides, API references, and practical examples.',
    status: ResourceStatus.READING,
    rating: 5,
    categoryName: 'Frontend',
  },
  {
    title: 'Next.js Documentation',
    url: 'https://nextjs.org/docs',
    notes:
      'Useful reference for App Router, server components, routing, and deployment.',
    status: ResourceStatus.READING,
    rating: 5,
    categoryName: 'Frontend',
  },
  {
    title: 'TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs/',
    notes:
      'Core TypeScript concepts explained clearly. Good for checking types, unions, and narrowing.',
    status: ResourceStatus.TO_READ,
    rating: null,
    categoryName: 'TypeScript',
  },
  {
    title: 'JavaScript.info',
    url: 'https://javascript.info',
    notes:
      'Detailed JavaScript lessons covering fundamentals, browser APIs, objects, async code, and more.',
    status: ResourceStatus.FINISHED,
    rating: 5,
    categoryName: 'JavaScript',
  },
  {
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    notes:
      'Reliable reference for HTML, CSS, JavaScript, browser APIs, and web platform behavior.',
    status: ResourceStatus.FINISHED,
    rating: 5,
    categoryName: 'Frontend',
  },
  {
    title: 'Prisma Documentation',
    url: 'https://www.prisma.io/docs',
    notes:
      'Reference for Prisma schema, migrations, relations, and querying PostgreSQL from a Next.js app.',
    status: ResourceStatus.TO_READ,
    rating: null,
    categoryName: 'Backend',
  },
  {
    title: 'Node.js Documentation',
    url: 'https://nodejs.org/docs/latest/api/',
    notes:
      'Official Node.js API documentation. Useful for understanding backend runtime behavior.',
    status: ResourceStatus.TO_READ,
    rating: null,
    categoryName: 'Backend',
  },
  {
    title: 'Refactoring UI',
    url: 'https://www.refactoringui.com/',
    notes:
      'Practical UI design advice for developers. Useful for spacing, hierarchy, and visual polish.',
    status: ResourceStatus.READING,
    rating: 4,
    categoryName: 'Design',
  },
] as const

async function main() {
  const categoryByName = new Map<string, { id: string }>()

  for (const category of categories) {
    const savedCategory = await prisma.category.upsert({
      where: {
        userId_name: {
          userId: seedUserId,
          name: category.name,
        },
      },
      update: {
        color: category.color,
      },
      create: {
        userId: seedUserId,
        name: category.name,
        color: category.color,
      },
      select: {
        id: true,
      },
    })

    categoryByName.set(category.name, savedCategory)
  }

  for (const resource of resources) {
    const category = categoryByName.get(resource.categoryName)

    if (!category) {
      throw new Error(`Missing category: ${resource.categoryName}`)
    }

    const existingResource = await prisma.resource.findFirst({
      where: {
        userId: seedUserId,
        title: resource.title,
      },
      select: {
        id: true,
      },
    })

    if (existingResource) {
      continue
    }

    await prisma.resource.create({
      data: {
        userId: seedUserId,
        title: resource.title,
        url: resource.url,
        notes: resource.notes,
        status: resource.status,
        rating: resource.rating,
        categoryId: category.id,
      },
    })
  }

  console.log('Database seeded successfully.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
