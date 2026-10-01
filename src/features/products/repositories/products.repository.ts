import type { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/shared/db/prisma"
import type { Product, ProductsResponse } from "@/types/product"
import { productSchema } from "../products.schemas"
import type { ProductListQuery } from "../products.types"

const productSelect = {
  id: true,
  title: true,
  handle: true,
  description: true,
  thumbnail: true,
  images: true,
  variants: true,
  options: true,
  tags: true,
  collection: true,
  createdAt: true,
} satisfies Prisma.ProductSelect

type ProductRow = Prisma.ProductGetPayload<{ select: typeof productSelect }>

// JSON columns come back untyped, so the row is parsed into the Product shape instead of cast.
function toProduct(row: ProductRow): Product {
  const { createdAt, ...fields } = row
  return productSchema.parse({ ...fields, created_at: createdAt.toISOString() })
}

function toProductCreateInput(product: Product): Prisma.ProductCreateManyInput {
  const { created_at, ...fields } = product
  return { ...fields, createdAt: new Date(created_at) }
}

// Prisma's `contains` becomes ILIKE without escaping, so `%` and `_` in the search text would act as wildcards.
function escapeLikeWildcards(text: string): string {
  return text.replace(/[\\%_]/g, "\\$&")
}

function buildProductWhere(query: ProductListQuery): Prisma.ProductWhereInput {
  const conditions: Prisma.ProductWhereInput[] = []

  if (query.q) {
    const searchText: string = escapeLikeWildcards(query.q)
    conditions.push({
      OR: [{ title: { contains: searchText, mode: "insensitive" } }, { description: { contains: searchText, mode: "insensitive" } }],
    })
  }

  if (query.collection) {
    conditions.push({ collection: { path: ["handle"], equals: query.collection } })
  }

  if (query.tag) {
    conditions.push({ tags: { array_contains: [{ value: query.tag }] } })
  }

  return { AND: conditions }
}

export async function findProducts(query: ProductListQuery): Promise<ProductsResponse> {
  const where: Prisma.ProductWhereInput = buildProductWhere(query)
  const [count, rows] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({ where, select: productSelect, orderBy: { id: "asc" }, take: query.limit, skip: query.offset }),
  ])

  return { products: rows.map(toProduct), count, limit: query.limit, offset: query.offset }
}

export async function findProductById(id: string): Promise<Product | null> {
  const row: ProductRow | null = await prisma.product.findUnique({ where: { id }, select: productSelect })

  if (!row) {
    return null
  }

  return toProduct(row)
}

export async function insertMissingProducts(products: Product[]): Promise<number> {
  const result = await prisma.product.createMany({ data: products.map(toProductCreateInput), skipDuplicates: true })
  return result.count
}
