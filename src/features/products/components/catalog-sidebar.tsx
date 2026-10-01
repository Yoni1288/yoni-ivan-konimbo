import { Suspense } from "react"
import { CategoryList, CategoryListSkeleton } from "@/features/categories/components/category-list"
import { PriceFilter, PriceFilterFallback } from "./price-filter"

const SidebarHeading = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  return <h2 className="text-2xs font-medium tracking-widest text-muted uppercase">{children}</h2>
}

export const CatalogSidebar = (): React.JSX.Element => {
  return (
    <aside className="flex min-w-0 flex-col gap-6">
      <section>
        <SidebarHeading>Category</SidebarHeading>
        <Suspense fallback={<CategoryListSkeleton />}>
          <CategoryList />
        </Suspense>
      </section>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
        <section>
          <SidebarHeading>Price</SidebarHeading>
          <Suspense fallback={<PriceFilterFallback />}>
            <PriceFilter />
          </Suspense>
        </section>
        <section>
          <SidebarHeading>Availability</SidebarHeading>
          <label className="mt-2 flex min-h-11 cursor-pointer items-center gap-3 text-sm">
            <input type="checkbox" className="size-4 accent-ink" />
            In stock only
          </label>
        </section>
      </div>
    </aside>
  )
}
