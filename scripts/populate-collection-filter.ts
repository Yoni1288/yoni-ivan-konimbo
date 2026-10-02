import { PrismaPg } from "@prisma/adapter-pg"
import Redis from "ioredis"
import { PrismaClient } from "../src/generated/prisma/client"
import { CATEGORY_FILTER_KEY } from "../src/features/categories/categories.constants"
import { categoryFilterSchema } from "../src/features/categories/categories.schemas"
import type { CategoryFilter } from "../src/features/categories/categories.types"
import { buildCategoryFilter } from "../src/features/categories/repositories/category-filter-seed.repository"

// Runs outside Next.js (Docker's db-init service), so like prisma/seed.ts it reads process.env directly and creates its own clients.
const prisma: PrismaClient = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })
const redis: Redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379")

const populateCollectionFilter = async (): Promise<void> => {
  const categoryFilter: CategoryFilter = categoryFilterSchema.parse(await buildCategoryFilter(prisma))

  if (!categoryFilter.collections.length) {
    throw new Error("No collections in the database. Run the seed first.")
  }

  await redis.set(CATEGORY_FILTER_KEY, JSON.stringify(categoryFilter))
  console.log(`Stored ${CATEGORY_FILTER_KEY}: ${categoryFilter.collections.length} collections, ${categoryFilter.total} products.`)
}

populateCollectionFilter().finally(() => Promise.all([prisma.$disconnect(), redis.quit()]))
