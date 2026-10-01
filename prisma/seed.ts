import { PrismaPg } from "@prisma/adapter-pg"
import { z } from "zod"
import { PrismaClient } from "../src/generated/prisma/client"
import { seedAdminEnvSchema } from "../src/features/auth/auth.schemas"
import type { SeedAdmin } from "../src/features/auth/auth.types"
import { upsertAdminUser } from "../src/features/auth/repositories/users-seed.repository"
import { productSchema } from "../src/features/products/products.schemas"
import { replaceAllProducts } from "../src/features/products/repositories/products-seed.repository"
import productsData from "../mock-data/products.json"

// The seed runs outside Next.js, so it reads process.env directly and creates its own client instead of importing the server-only env module.
const prisma: PrismaClient = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })

// Replaces all catalog data in one transaction, so seeding is safe to rerun (Docker runs it on every app start).
const seedProducts = async (): Promise<void> => {
  const products = z.array(productSchema).parse(productsData)
  await replaceAllProducts(prisma, products)
  console.log(`Seeded ${products.length} products.`)
}

const seedAdminUser = async (admin: SeedAdmin): Promise<void> => {
  await upsertAdminUser(prisma, admin)
  console.log(`Seeded admin user "${admin.userName}".`)
}

// Admin credentials come from SEED_ADMIN_* in .env, so no password is committed.
// They are validated before anything is written, so a missing or short value fails without touching the database.
const seed = async (): Promise<void> => {
  const admin: SeedAdmin = seedAdminEnvSchema.parse(process.env)
  await seedProducts()
  await seedAdminUser(admin)
}

seed().finally(() => prisma.$disconnect())
