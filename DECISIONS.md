# Decisions

## Normalized product schema

Products were first stored as one `products` table with JSON columns. They now live in relational tables: `collections`, `products`, `product_images`, `tags`, `product_tags`, `product_options`, `product_option_values`, `variants`, `variant_option_values` and `variant_prices`.

- **Option order is stored.** `product_options.position` was added to the original design. Variant titles such as `"500ml - White"` list option values in option order, and sorting options by id would put Color before Size for prod_03 and prod_20.
- **The API shape is unchanged.** `src/types/product.ts` and the route handlers are frozen, so the repository maps rows back to the `Product` type:
  - A NULL `description` or `thumbnail` becomes `""`.
  - Products without a collection are never returned, because `Product.collection` is required.
- **Variants are linked to option values at seed time.** The mock data has only variant titles. The seed splits each title on `" - "` and links the first N parts to the product's N options. Extra parts are ignored, e.g. prod_14's `"EU 42 - Black"` has only a Size option.
- **Tag order is not preserved.** `product_tags` has no position, so tags come back ordered by tag id, which can differ from the mock data's order.
- **Migration.** The migration deletes the old JSON rows before changing the table, and the seed replaces all catalog data in one transaction, so both are safe to rerun.
- **CHECK constraints.** `inventory_quantity >= 0` and `amount >= 0` are added in the migration SQL, because Prisma's schema can't express them.

## Styling helpers

- **clsx + tailwind-merge (`cn()` in `src/shared/utils/cn.ts`):** combines conditional classes and resolves Tailwind conflicts, so a later `text-white` replaces an earlier `text-muted` instead of both applying. tailwind-merge already recognises the custom tokens (`text-2xs`, `bg-ink`, `grid-cols-sidebar`), so it needs no extra config.
- **class-variance-authority:** gives components with visual variants (stock badge, category button, pagination button) one typed variant map instead of ternaries between whole class strings.
- **prettier-plugin-tailwindcss:** sorts class names on `pnpm format`, so class order never shows up as a review diff. `tailwindStylesheet` points it at `globals.css`, which it needs for Tailwind v4.
- **No arbitrary values.** Missing sizes became theme tokens:
  - `--text-2xs` (11px)
  - `--grid-template-columns-sidebar` / `-pagination`
  - `--color-swatch-*`: swatch colors moved from inline `style` hex values to tokens.
- **Cart badge.** It used `text-[10px]`; it now uses `text-2xs` (11px) rather than adding a one-off token.
