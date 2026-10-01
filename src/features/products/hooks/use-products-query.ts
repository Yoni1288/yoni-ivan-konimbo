import { keepPreviousData, useQuery, type UseQueryResult } from "@tanstack/react-query"
import type { ProductsResponse } from "@/types/product"
import { fetchProducts } from "../api/fetch-products"
import { productKeys } from "../api/product-keys"

export function useProductsQuery(): UseQueryResult<ProductsResponse> {
  return useQuery({ queryKey: productKeys.list(), queryFn: fetchProducts, placeholderData: keepPreviousData })
}
