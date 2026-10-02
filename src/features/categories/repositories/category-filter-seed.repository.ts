import type { PrismaClient } from "@/generated/prisma/client"
import type { CategoryFilter } from "../categories.types"

// Takes the client as a parameter like the other seed repositories: the shared client depends on the server-only env module.
// `total` only counts products with a collection, matching `hasCollection` in products.repository.ts. Empty collections stay in with count 0.
export const buildCategoryFilter = async (client: PrismaClient): Promise<CategoryFilter> => {
  const [total, collections] = await Promise.all([
    client.product.count({ where: { collectionId: { not: null } } }),
    client.collection.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true, handle: true, _count: { select: { products: true } } },
    }),
  ])

  return {
    total,
    collections: collections.map(({ _count, ...collection }) => ({ ...collection, count: _count.products })),
  }
}
