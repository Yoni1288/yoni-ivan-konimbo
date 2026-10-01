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
- **Stored `min_price` for sorting by price.** "Price: low to high" orders products by their cheapest variant price, the same "From" price the card shows. Prisma's `orderBy` can't use `MIN()` over a relation (only `_count`), so `products.min_price` is filled by the seed and backfilled in its migration. Sorting and pagination then stay in the database. Sorting in memory would have needed every matching product loaded, and raw SQL would have duplicated the search and collection filters.
- **The price filter uses the same `min_price`.** A product matches when its lowest variant price is in the range, so filtering agrees with the "From" price on the card and with the price sort. The API takes `min_price` / `max_price` in minor units, like every amount it returns. The page URL (`price_from` / `price_to`) and the inputs use whole shekels, and `fetchProducts` converts between them.
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

## Cart state (Zustand)

- **Why Zustand.** Cart lines and the drawer's open state are needed by unrelated parts of the tree (header button, drawer, Quick View). Zustand needs no provider, components subscribe through selectors so only what changed re-renders, and `persist` saves the cart to `localStorage` without extra code. A React Context would re-render every consumer on each change; Redux is far more setup for one store.
- **Only what can't be computed is stored.** The store holds `items` and `isOpen`. Item count and subtotal are selectors (`cart.selectors.ts`). The Quick View's selected options and its quantity stepper stay component state; they only become cart state when "Add to cart" is pressed.
- **Lines are snapshots keyed by `variantId`.** Adding the same variant again raises its quantity. Each line stores `inventoryQuantity`, so quantity is clamped to stock (and a sold-out variant is never added) without refetching.
- **Hydration.** `persist` uses `skipHydration`, and `useCartHydration` calls `rehydrate()` in an effect. The server and the first client render both see an empty cart, so there is no hydration mismatch; the saved cart appears right after mount. Only `items` are persisted (`partialize`), so the drawer never reopens on reload.
- **Adding closes Quick View and opens the cart drawer**, so the shopper sees what was added and the new total.

## Redis

- Redis 7 runs as a `redis` service in `docker-compose.yml` with a `redis-cli ping` healthcheck and a named volume (`redis_data`, append-only file on). The app container waits for it to be healthy and reaches it at `redis://redis:6379`; on the host it's `REDIS_URL=redis://localhost:6379` from `.env`.
- Client: `ioredis`, because it has built-in reconnects, TypeScript types and lazy connect. A single instance is exported from `src/shared/cache/redis.ts` and cached on `globalThis` in dev, the same way as the Prisma client. `lazyConnect` means `next build` and tests don't open a connection unless a command runs.

## Environment variables

- Server env is one Zod schema in `src/shared/config/env.server.ts`, parsed at import time. A missing or malformed `DATABASE_URL` / `REDIS_URL` fails at startup with a clear error instead of at the first query. `import "server-only"` makes a client-component import a build error.
- No env library such as `@t3-oss/env-nextjs`: we only have server variables, and a ten-line Zod module does the same job without another dependency. `server-only` is the only package added.
- `prisma.config.ts` and `prisma/seed.ts` run outside Next.js, so they read `process.env` directly. The seed builds its own `PrismaClient` and passes it to `replaceAllProducts`, because the shared client depends on the server-only env module.
- Tests use Redis database 1 (`redis://localhost:6379/1`) from `.env.test`, so they never touch dev keys in database 0.
