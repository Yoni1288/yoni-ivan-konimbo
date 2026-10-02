import { z } from "zod"
import { productSchema } from "@/features/products/products.schemas"
import { SEARCH_MIN_LENGTH } from "./search.constants"

export const searchQuerySchema = z.object({
  q: z.string().trim().min(SEARCH_MIN_LENGTH),
  limit: z.coerce.number().int().min(1).max(20).default(8),
})

export const searchResponseSchema = z.object({
  products: z.array(productSchema),
})
