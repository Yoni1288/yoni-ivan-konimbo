type SidebarCategory = {
  label: string
  count: number
}

// Static placeholder copied from the design; filtering is not wired up yet.
const CATEGORIES: SidebarCategory[] = [
  { label: "All products", count: 12 },
  { label: "Audio", count: 2 },
  { label: "Workspace", count: 3 },
  { label: "Home", count: 3 },
  { label: "Travel", count: 1 },
  { label: "Fitness", count: 3 },
]

const ACTIVE_CATEGORY: string = "All products"

function SidebarHeading({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <h2 className="text-[11px] font-medium tracking-widest text-muted uppercase">{children}</h2>
}

function CategoryList(): React.JSX.Element {
  return (
    <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
      {CATEGORIES.map((category) => {
        const isActive: boolean = category.label === ACTIVE_CATEGORY
        const stateClasses: string = isActive ? "bg-ink text-white" : "hover:bg-black/5"
        return (
          <li key={category.label} className="shrink-0">
            <button type="button" aria-pressed={isActive} className={`flex h-11 w-full items-center justify-between gap-4 rounded-lg px-3 text-sm ${stateClasses}`}>
              <span className="whitespace-nowrap">{category.label}</span>
              <span className={`text-xs ${isActive ? "text-white/80" : "text-muted"}`}>{category.count}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function PriceRange(): React.JSX.Element {
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

export function CatalogSidebar(): React.JSX.Element {
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
