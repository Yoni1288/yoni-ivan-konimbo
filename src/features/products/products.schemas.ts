import { z } from "zod"
import type { Product, ProductsResponse } from "@/types/product"

const priceSchema = z.object({
  amount: z.number(),
  currency_code: z.string(),
})

const productVariantSchema = z.object({
  id: z.string(),
  title: z.string(),
  sku: z.string(),
  prices: z.array(priceSchema),
  inventory_quantity: z.number(),
})

export const productSchema: z.ZodType<Product> = z.object({
  id: z.string(),
  title: z.string(),
  handle: z.string(),
  description: z.string(),
  thumbnail: z.string(),
  images: z.array(z.object({ url: z.string() })),
  variants: z.array(productVariantSchema),
  options: z.array(z.object({ id: z.string(), title: z.string(), values: z.array(z.string()) })),
  tags: z.array(z.object({ value: z.string() })),
  collection: z.object({ id: z.string(), title: z.string(), handle: z.string() }),
  created_at: z.string(),
})

export const productSortSchema = z.enum(["featured", "price_asc", "price_desc", "newest"])

const priceAmountSchema = z.coerce.number().int().min(0)

// min_price and max_price are in minor units, like every amount the API returns, and match a product's lowest variant price.
export const productListQuerySchema = z
  .object({
    q: z.string().trim().min(1).optional(),
    collection: z.string().optional(),
    tag: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(12),
    offset: z.coerce.number().int().min(0).default(0),
    sort: productSortSchema.default("featured"),
    min_price: priceAmountSchema.optional(),
    max_price: priceAmountSchema.optional(),
  })
  .refine((query) => query.min_price === undefined || query.max_price === undefined || query.min_price <= query.max_price, {
    message: "min_price must not be greater than max_price",
    path: ["max_price"],
  })

export const productIdParamsSchema = z.object({
  id: z.string().min(1),
})

export const productsResponseSchema: z.ZodType<ProductsResponse> = z.object({
  products: z.array(productSchema),
  count: z.number(),
  limit: z.number(),
  offset: z.number(),
})

// URL params are user-editable, so an invalid offset falls back to the first page instead of throwing.
export const productFiltersSchema = z.object({
  offset: z.coerce.number().int().min(0).catch(0),
  collection: z.string().min(1).optional().catch(undefined),
  sort: productSortSchema.catch("featured"),
  priceFrom: priceAmountSchema.optional().catch(undefined),
  priceTo: priceAmountSchema.optional().catch(undefined),
})

const priceInputSchema = z
  .string()
  .trim()
  .transform((value) => value || undefined)
  .pipe(z.coerce.number<string>({ error: "Enter a whole number" }).int("Enter a whole number").min(0, "Enter 0 or more").optional())

// The sidebar inputs are whole shekels, like the prices shown on the cards.
export const priceRangeFormSchema = z.object({ from: priceInputSchema, to: priceInputSchema }).refine((range) => range.from === undefined || range.to === undefined || range.from <= range.to, {
  message: "“From” must not be more than “To”",
  path: ["to"],
})
