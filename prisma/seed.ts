import { z } from "zod"
import { productSchema } from "../src/features/products/products.schemas"
import { insertMissingProducts } from "../src/features/products/repositories/products.repository"
import { prisma } from "../src/shared/db/prisma"
import productsData from "../mock-data/products.json"

// Inserts only products that don't exist yet, so seeding is safe to rerun (Docker runs it on every app start).
async function seedProducts(): Promise<void> {
  const products = z.array(productSchema).parse(productsData)
  const insertedCount: number = await insertMissingProducts(products)
  console.log(`Seeded ${insertedCount} new products (${products.length} in mock data).`)
}

seedProducts().finally(() => prisma.$disconnect())
