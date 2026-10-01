import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { startTransition } from "react"
import { productFiltersSchema } from "../products.schemas"
import type { PriceRange, ProductFilters, ProductFiltersState, ProductSort } from "../products.types"

const setOptionalParam = (params: URLSearchParams, name: string, value: number | undefined): void => {
  if (value === undefined) {
    params.delete(name)
  } else {
    params.set(name, String(value))
  }
}

const buildUrl = (pathname: string, params: URLSearchParams): string => {
  const query: string = params.toString()
  return query ? `${pathname}?${query}` : pathname
}

export const useProductFilters = (): ProductFiltersState => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname: string = usePathname()
  const filters: ProductFilters = productFiltersSchema.parse({
    offset: searchParams.get("offset") ?? undefined,
    collection: searchParams.get("collection") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    priceFrom: searchParams.get("price_from") ?? undefined,
    priceTo: searchParams.get("price_to") ?? undefined,
  })

  const setOffset = (offset: number): void => {
    const params = new URLSearchParams(searchParams.toString())

    if (offset) {
      params.set("offset", String(offset))
    } else {
      params.delete("offset")
    }

    startTransition(() => router.replace(buildUrl(pathname, params)))
  }

  // Changing the category starts from the first page, since the old offset may be past the new result count.
  const setCollection = (collection: string | undefined): void => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("offset")

    if (collection) {
      params.set("collection", collection)
    } else {
      params.delete("collection")
    }

    startTransition(() => router.replace(buildUrl(pathname, params)))
  }

  // A new order changes what is on every page, so it also starts from the first page.
  const setSort = (sort: ProductSort): void => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("offset")

    if (sort === "featured") {
      params.delete("sort")
    } else {
      params.set("sort", sort)
    }

    startTransition(() => router.replace(buildUrl(pathname, params)))
  }

  const setPriceRange = (range: PriceRange): void => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("offset")
    setOptionalParam(params, "price_from", range.from)
    setOptionalParam(params, "price_to", range.to)

    startTransition(() => router.replace(buildUrl(pathname, params)))
  }

  return { filters, setOffset, setCollection, setSort, setPriceRange }
}
