import Link from "next/link"
import { CatalogSidebar } from "./catalog-sidebar"
import { CatalogToolbar } from "./catalog-toolbar"
import { ProductGrid } from "./product-grid"

export function ProductCatalog(): React.JSX.Element {
  return (
    <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8">
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">Products</span>
      </nav>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">All products</h1>

      <div className="mt-6 border-y border-line py-3">
        <CatalogToolbar />
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[180px_1fr] lg:gap-6">
        <CatalogSidebar />
        <ProductGrid />
      </div>
    </main>
  )
}
