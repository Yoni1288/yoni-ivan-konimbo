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
      <section className="sm:w-1/2 lg:w-auto">
        <SidebarHeading>Price</SidebarHeading>
        <Suspense fallback={<PriceFilterFallback />}>
          <PriceFilter />
        </Suspense>
      </section>
    </aside>
  )
}
