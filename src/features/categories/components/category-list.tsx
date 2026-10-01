"use client"

import { cva } from "class-variance-authority"
import { useCategoriesQuery } from "../hooks/use-categories-query"

type CategoryRow = {
  key: string
  label: string
  count: number
}

const SKELETON_COUNT: number = 6
const LIST_CLASSES: string = "mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1"

// Filtering by collection is not wired up yet, so "All products" is always the active row.
const ALL_PRODUCTS_KEY: string = "all"

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

const CategoryListSkeleton = (): React.JSX.Element => {
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
    { key: ALL_PRODUCTS_KEY, label: "All products", count: data.total },
    ...data.collections.map((collection) => ({ key: collection.id, label: collection.title, count: collection.count })),
  ]

  return (
    <ul className={LIST_CLASSES}>
      {rows.map((row) => {
        const isActive: boolean = row.key === ALL_PRODUCTS_KEY
        return (
          <li key={row.key} className="shrink-0">
            <button type="button" aria-pressed={isActive} className={categoryButton({ active: isActive })}>
              <span className="whitespace-nowrap">{row.label}</span>
              <span className={categoryCount({ active: isActive })}>{row.count}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
