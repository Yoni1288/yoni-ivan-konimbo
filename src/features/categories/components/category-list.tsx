"use client"

import { cva } from "class-variance-authority"
import { useProductFilters } from "@/features/products/hooks/use-product-filters"
import { useCategoriesQuery } from "../hooks/use-categories-query"

type CategoryRow = {
  handle: string | undefined
  label: string
  count: number
}

const SKELETON_COUNT: number = 6
const LIST_CLASSES: string = "mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1"

const categoryButton = cva("flex h-11 w-full items-center justify-between gap-4 rounded-lg px-3 text-sm", {
  variants: {
    active: {
      true: "bg-ink text-white",
      false: "hover:bg-black/5",
    },
  },
})

const categoryCount = cva("text-xs", {
  variants: {
    active: {
      true: "text-white/80",
      false: "text-muted",
    },
  },
})

export const CategoryListSkeleton = (): React.JSX.Element => {
  return (
    <ul className={LIST_CLASSES} aria-busy="true" aria-label="Loading categories">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <li key={index} className="h-11 w-28 animate-pulse rounded-lg bg-line lg:w-full" />
      ))}
    </ul>
  )
}

const CategoryMessage = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  return <p className="mt-3 text-sm text-muted">{children}</p>
}

export const CategoryList = (): React.JSX.Element => {
  const { data, isPending, isError } = useCategoriesQuery()
  const { filters, setCollection } = useProductFilters()

  if (isPending) {
    return <CategoryListSkeleton />
  }

  if (isError) {
    return <CategoryMessage>Couldn&apos;t load categories.</CategoryMessage>
  }

  if (!data.collections.length) {
    return <CategoryMessage>No categories yet.</CategoryMessage>
  }

  const rows: CategoryRow[] = [
    { handle: undefined, label: "All products", count: data.total },
    ...data.collections.map((collection) => ({ handle: collection.handle, label: collection.title, count: collection.count })),
  ]

  return (
    <ul className={LIST_CLASSES}>
      {rows.map((row) => {
        const isActive: boolean = row.handle === filters.collection
        return (
          <li key={row.handle ?? "all"} className="shrink-0">
            <button type="button" aria-pressed={isActive} onClick={() => setCollection(row.handle)} className={categoryButton({ active: isActive })}>
              <span className="whitespace-nowrap">{row.label}</span>
              <span className={categoryCount({ active: isActive })}>{row.count}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
