import { CategoryList } from "@/features/categories/components/category-list"

const SidebarHeading = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  return <h2 className="text-2xs font-medium tracking-widest text-muted uppercase">{children}</h2>
}

const PriceRange = (): React.JSX.Element => {
  const inputClasses: string = "mt-1 h-11 w-full min-w-0 rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-ink"
  return (
    <div className="mt-3 flex items-end gap-2">
      <label className="flex-1 text-xs text-muted">
        Min
        <input type="text" inputMode="numeric" placeholder="$0" className={inputClasses} />
      </label>
      <span className="pb-3 text-muted">–</span>
      <label className="flex-1 text-xs text-muted">
        Max
        <input type="text" inputMode="numeric" placeholder="$1,500" className={inputClasses} />
      </label>
    </div>
  )
}

export const CatalogSidebar = (): React.JSX.Element => {
  return (
    <aside className="flex min-w-0 flex-col gap-6">
      <section>
        <SidebarHeading>Category</SidebarHeading>
        <CategoryList />
      </section>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
        <section>
          <SidebarHeading>Price</SidebarHeading>
          <PriceRange />
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
