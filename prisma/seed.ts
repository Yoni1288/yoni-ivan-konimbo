import { PrismaPg } from "@prisma/adapter-pg"
import { z } from "zod"
import { PrismaClient } from "../src/generated/prisma/client"
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

seedProducts().finally(() => prisma.$disconnect())
