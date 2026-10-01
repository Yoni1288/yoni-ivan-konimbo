import { apiGet } from "@/shared/api/api-client"
import type { ProductsResponse } from "@/types/product"
import { productsResponseSchema } from "../products.schemas"
import type { ProductFilters } from "../products.types"

const MINOR_UNITS_PER_SHEKEL: number = 100

export const fetchProducts = (filters: ProductFilters): Promise<ProductsResponse> => {
  const { offset, collection, sort, priceFrom, priceTo } = filters
  const params = new URLSearchParams({ offset: String(offset) })

  if (collection) {
    params.set("collection", collection)
  }

  if (sort !== "featured") {
    params.set("sort", sort)
  }

  if (priceFrom !== undefined) {
    params.set("min_price", String(priceFrom * MINOR_UNITS_PER_SHEKEL))
  }

  if (priceTo !== undefined) {
    params.set("max_price", String(priceTo * MINOR_UNITS_PER_SHEKEL))
  }

  return apiGet(`/api/products?${params}`, productsResponseSchema)
}
