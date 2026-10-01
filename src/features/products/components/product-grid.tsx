"use client"

import { useState } from "react"
import { QuickViewDialog } from "@/features/quick-view/components/quick-view-dialog"
import { cn } from "@/shared/utils/cn"
import type { Product } from "@/types/product"
import { useProductFilters } from "../hooks/use-product-filters"
import { useProductsQuery } from "../hooks/use-products-query"
import type { GridMessageProps } from "../products.types"
import { CatalogPagination } from "./catalog-pagination"
import { ProductCard } from "./product-card"

const GRID_CLASSES: string = "grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
const SKELETON_COUNT: number = 6

export const ProductGridSkeleton = (): React.JSX.Element => {
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

const GridMessage = ({ title, detail, children }: GridMessageProps): React.JSX.Element => {
  return (
    <div className="rounded-xl border border-line px-6 py-16 text-center">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted">{detail}</p>
      {children}
    </div>
  )
}

export const ProductGrid = (): React.JSX.Element => {
  const { filters, setOffset } = useProductFilters()
  const { data, isPending, isError, isPlaceholderData } = useProductsQuery(filters)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  if (isPending) {
    return <ProductGridSkeleton />
  }

  if (isError) {
    return <GridMessage title="Couldn't load products" detail="Please refresh the page to try again." />
  }

  // A stale or hand-edited URL can point past the last page; offer a way back instead of a dead end.
  if (!data.products.length && filters.offset) {
    return (
      <GridMessage title="This page is empty" detail="There are fewer products than this page expects.">
        <button type="button" onClick={() => setOffset(0)} className="mt-4 h-11 rounded-full border border-ink px-6 text-sm font-medium transition-colors hover:bg-ink hover:text-white">
          Back to first page
        </button>
      </GridMessage>
    )
  }

  if (!data.products.length) {
    return <GridMessage title="No products found" detail="Try a different search or filter." />
  }

  return (
    <section aria-label="Products">
      <div className={cn(GRID_CLASSES, "transition-opacity", isPlaceholderData && "opacity-60")} aria-busy={isPlaceholderData}>
        {data.products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} onQuickView={setQuickViewProduct} />
        ))}
      </div>
      <CatalogPagination offset={data.offset} limit={data.limit} shown={data.products.length} total={data.count} onOffsetChange={setOffset} />
      {quickViewProduct && <QuickViewDialog key={quickViewProduct.id} product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </section>
  )
}
