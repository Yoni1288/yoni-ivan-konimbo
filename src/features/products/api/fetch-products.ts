import { apiGet } from "@/shared/api/api-client"
import type { ProductsResponse } from "@/types/product"
import { productsResponseSchema } from "../products.schemas"

export function fetchProducts(): Promise<ProductsResponse> {
  return apiGet("/api/products", productsResponseSchema)
}
