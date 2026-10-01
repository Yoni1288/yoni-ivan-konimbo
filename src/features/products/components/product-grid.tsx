"use client"

import { useProductsQuery } from "../hooks/use-products-query"
import { CatalogPagination } from "./catalog-pagination"
import { ProductCard } from "./product-card"

const GRID_CLASSES: string = "grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
const SKELETON_COUNT: number = 6

function ProductGridSkeleton(): React.JSX.Element {
  return (
    <div className={GRID_CLASSES} aria-busy="true" aria-label="Loading products">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-4/5 rounded-xl bg-line" />
          <div className="mt-3 h-3 w-1/4 rounded bg-line" />
          <div className="mt-2 h-4 w-2/3 rounded bg-line" />
        </div>
      ))}
    </div>
  )
}

function GridMessage({ title, detail }: { title: string; detail: string }): React.JSX.Element {
  return (
    <div className="rounded-xl border border-line px-6 py-16 text-center">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted">{detail}</p>
    </div>
  )
}

export function ProductGrid(): React.JSX.Element {
  const { data, isPending, isError } = useProductsQuery()

  if (isPending) {
    return <ProductGridSkeleton />
  }

  if (isError) {
    return <GridMessage title="Couldn't load products" detail="Please refresh the page to try again." />
  }

  if (!data.products.length) {
    return <GridMessage title="No products found" detail="Try a different search or filter." />
  }

  return (
    <section aria-label="Products">
      <div className={GRID_CLASSES}>
        {data.products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
      <CatalogPagination offset={data.offset} limit={data.limit} shown={data.products.length} total={data.count} />
    </section>
  )
}
