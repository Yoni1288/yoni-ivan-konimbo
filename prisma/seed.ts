import { z } from "zod"
import { productSchema } from "../src/features/products/products.schemas"
import { replaceAllProducts } from "../src/features/products/repositories/products-seed.repository"
import { prisma } from "../src/shared/db/prisma"
import productsData from "../mock-data/products.json"

// Replaces all catalog data in one transaction, so seeding is safe to rerun (Docker runs it on every app start).
const seedProducts = async (): Promise<void> => {
  const products = z.array(productSchema).parse(productsData)
  await replaceAllProducts(products)
  console.log(`Seeded ${products.length} products.`)
}

seedProducts().finally(() => prisma.$disconnect())
