# Mini Resource Library

Mini Resource Library is a small full-stack app for saving and managing learning resources. Signed-in users can create private resources with a title, URL, category, notes, status, and optional rating. The app uses Clerk for authentication, Prisma with PostgreSQL for data storage, and server actions for database mutations. One backend decision was to store categories in a separate table so users can manage their own category names and colors. One trade-off is that filtering, pagination, and search are intentionally simple instead of building a complex tagging or search system.

## Tech stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Clerk
- Prisma
- PostgreSQL

## Features

- Sign in and sign up with Clerk
- Private resources per user
- Create, edit, and delete resources
- Create and manage categories
- Filter resources by status and category
- Search resources by title
- Simple pagination
- Optional rating and notes
- Responsive dashboard layout

## Getting started

Install dependencies:

```bash
pnpm install
```

Create an `.env.local` file from the example file:

```bash
cp .env.local.example .env.local
```

Add your Clerk environment variables to `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_publishable_key"
CLERK_SECRET_KEY="your_secret_key"
SEED_USER_ID="your_clerk_user_id"
```

The database connection string is stored in `.env`:

```env
DATABASE_URL="your_database_url"
```

Generate the Prisma client:

```bash
pnpm db:generate
```

Run database migrations:

```bash
pnpm db:migrate
```

Start the development server:

```bash
pnpm dev
```

Open the app in the browser and sign up or sign in with Clerk.

## Seeding demo data

The seed script creates demo categories and resources for one Clerk user.

First, create or sign in with a user in the app. Then copy that user id from the Clerk dashboard and add it to `.env.local`:

```env
SEED_USER_ID="user_..."
```

Then run:

```bash
pnpm db:seed
```

The seed script can be run more than once. Existing demo categories are updated, and demo resources with the same title are skipped.

## Useful scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm typecheck
pnpm db:generate
pnpm db:migrate
pnpm db:studio
pnpm db:reset
pnpm db:seed
```

## Data model

Each resource belongs to one authenticated user and one category. Categories also belong to a user, so each user manages their own private category list. Deleting a category is restricted while resources still use it.

## Backend flow

Forms submit to server actions. The server actions validate input, check the authenticated Clerk user, confirm ownership of the resource or category, write to PostgreSQL through Prisma, and revalidate the affected pages. This keeps the full request → database → response flow simple and easy to explain.

## Environment variables

`.env`:

```env
DATABASE_URL="your_database_url"
```

`.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_publishable_key"
CLERK_SECRET_KEY="your_secret_key"
SEED_USER_ID="your_clerk_user_id"
```

## Notes

This project is intentionally small. It does not include sharing, roles, public profiles, advanced search, import/export, or file uploads.
