import type { Prisma } from "@/generated/prisma/client"
import { getOrSetJson } from "@/shared/cache/cache-json"
import { prisma } from "@/shared/db/prisma"
import type { Product, ProductOption, ProductsResponse, ProductVariant } from "@/types/product"
import { productsResponseSchema } from "../products.schemas"
import type { ProductListQuery, ProductSort } from "../products.types"

const PRODUCTS_CACHE_TTL_SECONDS: number = 5 * 60

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
  const { id, title, values } = option
  return { id, title, values: values.map((optionValue) => optionValue.value) }
}

const toProductVariant = (variant: VariantRow): ProductVariant => {
  const { id, title, sku, prices, inventoryQuantity } = variant

  return {
    id,
    title,
    sku,
    prices: prices.map((price) => ({ amount: price.amount, currency_code: price.currencyCode })),
    inventory_quantity: inventoryQuantity,
  }
}

const toProduct = (row: ProductRow): Product => {
  const { id, title, handle, description, thumbnail, images, variants, options, tags, collection, createdAt } = row

  if (!collection) {
    throw new Error(`Product ${id} has no collection`)
  }

  return {
    id,
    title,
    handle,
    description: description ?? "",
    thumbnail: thumbnail ?? "",
    images,
    variants: variants.map(toProductVariant),
    options: options.map(toProductOption),
    tags: tags.map((productTag) => productTag.tag),
    collection,
    created_at: createdAt.toISOString(),
  }
}

// id breaks ties so products with the same price or date keep a stable order across pages.
const PRODUCT_ORDER_BY: Record<ProductSort, Prisma.ProductOrderByWithRelationInput[]> = {
  featured: [{ id: "asc" }],
  price_asc: [{ minPrice: "asc" }, { id: "asc" }],
  price_desc: [{ minPrice: "desc" }, { id: "asc" }],
  newest: [{ createdAt: "desc" }, { id: "asc" }],
}

// Prisma's `contains` becomes ILIKE without escaping, so `%` and `_` in the search text would act as wildcards.
const escapeLikeWildcards = (text: string): string => {
  return text.replace(/[\\%_]/g, "\\$&")
}

const buildProductWhere = (query: ProductListQuery): Prisma.ProductWhereInput => {
  const { q, collection, tag, min_price, max_price } = query
  const conditions: Prisma.ProductWhereInput[] = [hasCollection]

  if (q) {
    const searchText: string = escapeLikeWildcards(q)
    conditions.push({
      OR: [{ title: { contains: searchText, mode: "insensitive" } }, { description: { contains: searchText, mode: "insensitive" } }],
    })
  }

  if (collection) {
    conditions.push({ collection: { handle: collection } })
  }

  if (tag) {
    conditions.push({ tags: { some: { tag: { value: tag } } } })
  }

  if (min_price !== undefined || max_price !== undefined) {
    conditions.push({ minPrice: { gte: min_price, lte: max_price } })
  }

  return { AND: conditions }
}

const queryProducts = async (query: ProductListQuery): Promise<ProductsResponse> => {
  const { sort, limit, offset } = query
  const where: Prisma.ProductWhereInput = buildProductWhere(query)
  const [count, rows] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({ where, select: productSelect, orderBy: PRODUCT_ORDER_BY[sort], take: limit, skip: offset }),
  ])

  return { products: rows.map(toProduct), count, limit, offset }
}

// Cached here rather than in the route, because src/app/api/products/ must not be modified.
// The key is the parsed query, so param order and defaults don't create separate entries.
export const findProducts = async (query: ProductListQuery): Promise<ProductsResponse> => {
  return getOrSetJson(JSON.stringify(query), PRODUCTS_CACHE_TTL_SECONDS, productsResponseSchema, () => queryProducts(query))
}

export const findProductById = async (id: string): Promise<Product | null> => {
  const row: ProductRow | null = await prisma.product.findFirst({ where: { id, ...hasCollection }, select: productSelect })

  if (!row) {
    return null
  }

  return toProduct(row)
}
