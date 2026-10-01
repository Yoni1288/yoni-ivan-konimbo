import type { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/shared/db/prisma"
import type { Product, ProductOption, ProductsResponse, ProductVariant } from "@/types/product"
import type { ProductListQuery } from "../products.types"

const productSelect = {
  id: true,
  title: true,
  handle: true,
  description: true,
  thumbnail: true,
  createdAt: true,
  collection: { select: { id: true, title: true, handle: true } },
  images: { select: { url: true }, orderBy: { position: "asc" } },
  tags: { select: { tag: { select: { value: true } } }, orderBy: { tagId: "asc" } },
  options: {
    select: { id: true, title: true, values: { select: { value: true }, orderBy: { id: "asc" } } },
    orderBy: { position: "asc" },
  },
  variants: {
    select: {
      id: true,
      title: true,
      sku: true,
      inventoryQuantity: true,
      prices: { select: { amount: true, currencyCode: true }, orderBy: { currencyCode: "asc" } },
    },
    orderBy: { id: "asc" },
  },
} satisfies Prisma.ProductSelect

type ProductRow = Prisma.ProductGetPayload<{ select: typeof productSelect }>

type OptionRow = ProductRow["options"][number]

type VariantRow = ProductRow["variants"][number]

// The Product API type requires a collection, so products without one are never returned.
const hasCollection = { collectionId: { not: null } } satisfies Prisma.ProductWhereInput

const toProductOption = (option: OptionRow): ProductOption => {
  return { id: option.id, title: option.title, values: option.values.map((optionValue) => optionValue.value) }
}

const toProductVariant = (variant: VariantRow): ProductVariant => {
  return {
    id: variant.id,
    title: variant.title,
    sku: variant.sku,
    prices: variant.prices.map((price) => ({ amount: price.amount, currency_code: price.currencyCode })),
    inventory_quantity: variant.inventoryQuantity,
  }
}

const toProduct = (row: ProductRow): Product => {
  if (!row.collection) {
    throw new Error(`Product ${row.id} has no collection`)
  }

  return {
    id: row.id,
    title: row.title,
    handle: row.handle,
    description: row.description ?? "",
    thumbnail: row.thumbnail ?? "",
    images: row.images,
    variants: row.variants.map(toProductVariant),
    options: row.options.map(toProductOption),
    tags: row.tags.map((productTag) => productTag.tag),
    collection: row.collection,
    created_at: row.createdAt.toISOString(),
  }
}

// Prisma's `contains` becomes ILIKE without escaping, so `%` and `_` in the search text would act as wildcards.
const escapeLikeWildcards = (text: string): string => {
  return text.replace(/[\\%_]/g, "\\$&")
}

const buildProductWhere = (query: ProductListQuery): Prisma.ProductWhereInput => {
  const conditions: Prisma.ProductWhereInput[] = [hasCollection]

  if (query.q) {
    const searchText: string = escapeLikeWildcards(query.q)
    conditions.push({
      OR: [{ title: { contains: searchText, mode: "insensitive" } }, { description: { contains: searchText, mode: "insensitive" } }],
    })
  }

  if (query.collection) {
    conditions.push({ collection: { handle: query.collection } })
  }

  if (query.tag) {
    conditions.push({ tags: { some: { tag: { value: query.tag } } } })
  }

  return { AND: conditions }
}

export const findProducts = async (query: ProductListQuery): Promise<ProductsResponse> => {
  const where: Prisma.ProductWhereInput = buildProductWhere(query)
  const [count, rows] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({ where, select: productSelect, orderBy: { id: "asc" }, take: query.limit, skip: query.offset }),
  ])

  return { products: rows.map(toProduct), count, limit: query.limit, offset: query.offset }
}

export const findProductById = async (id: string): Promise<Product | null> => {
  const row: ProductRow | null = await prisma.product.findFirst({ where: { id, ...hasCollection }, select: productSelect })

  if (!row) {
    return null
  }

  return toProduct(row)
}
