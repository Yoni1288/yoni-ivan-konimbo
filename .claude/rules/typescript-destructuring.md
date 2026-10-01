---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# Destructure objects read 3+ times

When a function reads properties of the same object 3 or more times in total (counting reads across all its properties), destructure the needed properties once near the top of the function and use those variables instead of repeating `obj.prop`.

## Bad

```ts
const buildProductWhere = (query: ProductListQuery): Prisma.ProductWhereInput => {
  const conditions: Prisma.ProductWhereInput[] = [hasCollection]
  if (query.q) {
    const searchText: string = escapeLikeWildcards(query.q)
    conditions.push({ OR: [{ title: { contains: searchText, mode: "insensitive" } }, { description: { contains: searchText, mode: "insensitive" } }] })
  }
  if (query.collection) conditions.push({ collection: { handle: query.collection } })
  if (query.tag) conditions.push({ tags: { some: { tag: { value: query.tag } } } })
  if (query.min_price !== undefined || query.max_price !== undefined) {
    conditions.push({ minPrice: { gte: query.min_price, lte: query.max_price } })
  }
  return { AND: conditions }
}
```

## Good

```ts
const buildProductWhere = (query: ProductListQuery): Prisma.ProductWhereInput => {
  const { q, collection, tag, min_price, max_price } = query
  const conditions: Prisma.ProductWhereInput[] = [hasCollection]
  if (q) {
    const searchText: string = escapeLikeWildcards(q)
    conditions.push({ OR: [{ title: { contains: searchText, mode: "insensitive" } }, { description: { contains: searchText, mode: "insensitive" } }] })
  }
  if (collection) conditions.push({ collection: { handle: collection } })
  if (tag) conditions.push({ tags: { some: { tag: { value: tag } } } })
  if (min_price !== undefined || max_price !== undefined) {
    conditions.push({ minPrice: { gte: min_price, lte: max_price } })
  }
  return { AND: conditions }
}
```

## Exceptions

Keep `obj.prop` when:

- The property is reassigned or mutated through the object (`obj.count += 1`), because a destructured copy wouldn't see the change.
- The prefix is clearer, for example when two similar objects are used side by side (`current.price` vs `previous.price`).
