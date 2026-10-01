import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { startTransition } from "react"
import { productFiltersSchema } from "../products.schemas"
import type { ProductFilters, ProductFiltersState } from "../products.types"

const buildUrl = (pathname: string, params: URLSearchParams): string => {
  const query: string = params.toString()
  return query ? `${pathname}?${query}` : pathname
}

export const useProductFilters = (): ProductFiltersState => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname: string = usePathname()
  const filters: ProductFilters = productFiltersSchema.parse({ offset: searchParams.get("offset") ?? undefined })

  const setOffset = (offset: number): void => {
    const params = new URLSearchParams(searchParams.toString())

    if (offset) {
      params.set("offset", String(offset))
    } else {
      params.delete("offset")
    }

    startTransition(() => router.replace(buildUrl(pathname, params)))
  }

  return { filters, setOffset }
}
