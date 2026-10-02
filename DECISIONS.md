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

## Sign-in page

- **Route groups.** `/login` uses a reduced header (logo and "Back to shop", no cart or footer). The shop pages moved into `src/app/(shop)/` with their own layout, and `/login` lives in `src/app/(auth)/`. The root layout only holds `<html>`, fonts and providers. URLs are unchanged.
- **React Hook Form + `@hookform/resolvers`.** The form is validated with the Zod `loginSchema` through `zodResolver`, validating on blur and again on change (`mode: "onTouched"`). Each error is linked with `aria-describedby`. The same setup will serve the checkout form.
- **Shared minimal header.** Sign-in and checkout use `MinimalHeader` (`src/shared/components/`), the logo plus one item on the right. Checkout has its own `(checkout)` route group, with "Secure checkout" in the header and no footer.
- **Checkout form.** The order summary reads the real cart store. It shows a skeleton until the saved cart has loaded (`useCartHydration` now returns that flag), so it never flashes an empty cart. "Place order" is disabled while the cart is empty.
- **No auth backend.** There are no users or sessions, so a valid submit only says that sign-in isn't connected yet instead of pretending to sign in.

## Users and orders

- **Tables.** `users`, `orders` and `order_items` (plus the `OrderStatus` enum) are in place for sign-in and checkout. Checkout writes orders (see "Placing an order").
- **User ids are auto-incrementing integers.** `users.id` started as a cuid and was changed to an integer (migration `users_int_id`), so `orders.user_id` is an integer too. Order and order-item ids are still cuids. The JWT stores the id as text in `sub`, because JWT requires a string there. The session store's persist version went to 1, so sessions saved with the old text id are dropped and those users sign in again.
- **Order items are snapshots.** They store the product and variant ids, title, SKU and unit price at the time of the order, with no foreign keys to the catalog. The seed wipes and reinserts the catalog, and old orders must not change or break when that happens. CHECK constraints keep quantities positive and amounts non-negative, as for prices.
- **Password hashing uses `scrypt` from `node:crypto`,** so there is no bcrypt or argon2 dependency. Hashes are stored as `scrypt$<salt>$<hash>` (`src/shared/auth/password.ts`), so the algorithm can change later.
- **Sign-in returns a 1-hour JWT.** `POST /api/auth/login` checks the password and returns an HS256 token signed with `JWT_SECRET` through `jose` (a standard, typed library, instead of hand-written signing). Its `sub` is the user id and it expires after 1 hour. There is no refresh token, so you sign in again after an hour. An unknown user and a wrong password get the same 401 message, so the response doesn't reveal which usernames exist.
- **The session is stored in `localStorage`, as requested.** It survives reloads and browser restarts, and an expired session is dropped when the page loads. The tradeoff is that any injected script (XSS) could read the token; an httpOnly cookie is the safer option later. The session lives in a second persisted Zustand store (`auth.store.ts`), following the cart's pattern. CLAUDE.md lists Zustand as "cart only", but the session is global client state that has to survive restarts, and this is the smallest fit.
- **Log out only forgets the token in this browser.** When you're signed in, `/login` shows a "Signed in" card with a Log out button instead of the form, and Log out clears the stored session. The JWT is stateless, so a copied token would stay valid until its hour is up. Revoking tokens on the server would need a denylist, or short-lived tokens with a refresh token.
- **Registration.** `/register` creates an account through `POST /api/auth/register` (201) and signs the user in straight away, with the same response as sign-in. The username and password rules live in one Zod schema, `registerCredentialsSchema`, which the route enforces. The form reuses it and adds "Confirm password". A taken username returns 409 and is shown on the username field. Usernames are stored lowercase, on both register and sign-in, so "Admin" and "admin" can't become two accounts. A signed-in user who opens `/register` or `/login` sees the "Signed in" card instead of a form.
- **Checkout requires sign-in.** The checkout page checks for an active session (`useRequireSession`). Without one, it redirects to `/login?next=/checkout`, which also happens if you log out while on checkout. The cart's Checkout button links to sign-in directly when you're signed out, so you don't see checkout load first. After signing in or registering, you're sent to `next`. `next` only accepts paths on this site (`redirectPathSchema`), so a crafted link can't redirect people to another website. The guard runs in the browser, because the session lives in `localStorage`. Once checkout creates orders, that API route must also verify the JWT on the server.
- **Only checkout uses auth.** Products, filters and the cart never read or wait for the session.
- **Seeded admin user.** `pnpm prisma db seed` (and so `/mock-to-db` and the `db-init` service on every `docker compose up`) upserts an admin from `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD` / `SEED_ADMIN_EMAIL`. For local dev the default is `admin` / `admin` (in `.env.example` and `.env.test`), so a fresh clone can sign in right away, and a route test checks exactly that. The seed only requires a non-empty password; anywhere outside local dev, `SEED_ADMIN_PASSWORD` must be set to a strong value. The seed validates these variables with Zod before writing anything. "Admin" is only the username for now; there is no role column.

## Placing an order

- **`POST /api/checkout`** needs a `Bearer` token. The server now verifies the JWT (`verifyAccessToken` with `jose`), takes the user id from `sub`, and returns 401 if the token is missing, invalid or expired. The client sends the token from the session store.
- **One Zod schema for the form and the route.** The route uses `checkoutFormSchema` plus the cart items (`checkoutRequestSchema`) and validates everything again, so the client-side checks are only for convenience. Invalid input returns 400.
- **Phone numbers use `libphonenumber-js`.** Whether a phone number is valid depends on the country, and a regex can't get that right. The number is checked against the chosen country, so `050-123-4567` is valid for Israel, and it's saved in E.164 (`+972501234567`). The phone is optional, but anything entered must be valid. The country is stored as an ISO code, which fits the `Char(2)` column and is also the phone's default region.
- **The email is saved on the user, not on the order.** `users.email` already exists, so the checkout email updates it. The user update and the order insert are one nested Prisma write, so they succeed or fail together. If another account already has that email, the route returns 409 and the form shows the message.
- **Prices come from the database.** The client sends only variant ids and quantities. The server reads the price, title and SKU from the catalog, builds the item snapshots and computes the totals, so a tampered cart can't change what's charged. Shipping is free, so the total equals the subtotal.
- **Stock is checked but not decremented.** A quantity above `inventory_quantity` returns 409. Inventory isn't reduced, so the reseedable catalog stays the same between orders. A real store would decrement it in the same transaction.
- **Order numbers** are `GS-` followed by 6 random hex characters. A collision is very unlikely, and it would hit the unique index and return 409.
- **Server error messages reach the form.** The API client now reads `message` from error responses. These messages are always safe, because `withErrorHandling` turns unknown errors into the generic 500. The form shows 4xx messages (for example out of stock) and a generic message for anything else.
- **The confirmation page loads the real order.** After checkout, the form goes to `/order-confirmation?order=GS-XXXXXX`. The page reads the order through `GET /api/order-confirmation/:orderNumber`, which needs the same bearer token as checkout. The query filters by order number **and** user id, so another user's order number returns the same 404 as a missing one and doesn't reveal that the order exists. A malformed order number returns 400 (`parseRouteParams`). Because the order number is in the URL, the page can be reloaded or bookmarked.
- **The cart is cleared once the order has loaded and is on screen,** and only after the saved cart has loaded, so a later rehydrate can't bring the items back.

## Product photos

- **The photos are local, in `public/s3-images/<productId>/`, and tracked in git.** Next.js serves them as static files (`/s3-images/prod_01/thumbnail.webp`), so `next/image` needs no `remotePatterns` entry, and there is no S3 bucket or env var. The folder name keeps the S3 naming, so moving to a real bucket later only changes the URL prefix.
- **`/map-s3-images` is the one sanctioned change to `mock-data/`.** The README says not to modify `mock-data/`, and that still holds for every other change. The catalog images had to point at the real photos, so this command may rewrite only `thumbnail` and `images` in `products.json`. CLAUDE.md records the exception.
- **A script does the edit, not the model.** `scripts/map-s3-images.ts` maps `thumbnail.webp` and `image_NN.*` (sorted by number) to URLs. It edits the text of each product block instead of rewriting the whole file, so the file's hand formatting and the git diff stay limited to those lines. Before writing, it parses the result and aborts if any field other than `thumbnail` or `images` differs. Products without a folder keep their picsum URLs, and a second run changes nothing.
- **The database must be reseeded to show the photos.** The app reads the catalog from Postgres, so the change appears after `/mock-to-db`. Cached product lists in Redis can show the old URLs for up to 5 minutes after that.

## Docker start-up (`db-init`)

- **A one-shot `db-init` service does the first-run setup.** It waits for Postgres and Redis to be healthy, then runs, in order: `scripts/map-s3-images.ts`, `prisma migrate deploy`, `prisma db seed` and `scripts/populate-collection-filter.ts` (the Redis `collection-filter` key the category sidebar reads). It exits when done, and `app` waits for `service_completed_successfully`, so a fresh `docker compose up` (or one after `down -v`) serves a filled catalog. Every step is idempotent, so it's safe on every start.
- **It's a separate service, not the app's start command,** so the host workflow gets the same setup: `docker compose up -d db-init` starts Postgres and Redis, runs the init and leaves port 3000 free for `pnpm dev`.
- **The mapping only touches the image's copy of `products.json`.** The host file is never rewritten, so the rule that only `/map-s3-images` changes `mock-data/` still holds. Photos are baked into the image, so new ones in `public/s3-images` need `docker compose up --build`.
- **The Redis key is built with Prisma**, not the raw SQL from `/populat-collection-from-db`, because raw SQL is off-limits in project code. Like the seed, the script runs outside Next.js and creates its own Prisma and Redis clients.

## Redis

- Redis 7 runs as a `redis` service in `docker-compose.yml` with a `redis-cli ping` healthcheck and a named volume (`redis_data`, append-only file on). The `db-init` and app containers reach it at `redis://redis:6379`; on the host it's `REDIS_URL=redis://localhost:6379` from `.env`.
- Client: `ioredis`, because it has built-in reconnects, TypeScript types and lazy connect. A single instance is exported from `src/shared/cache/redis.ts` and cached on `globalThis` in dev, the same way as the Prisma client. `lazyConnect` means `next build` and tests don't open a connection unless a command runs.

- **The products list is cached in Redis (cache-aside).** `findProducts` first looks for the key `JSON.stringify(query)`. On a hit it returns the cached response, and on a miss it queries Postgres and stores the result for 5 minutes. The key is the **parsed** Zod query, so param order (`?q=a&tag=b` vs `?tag=b&q=a`) and defaults (`?limit=12` vs no limit) don't create separate entries. The cache lives in the repository, behind `findProducts`, because `src/app/api/products/` must not be modified. `GET /api/products/:id` isn't cached.
- **Staleness is handled by the TTL alone.** The seed (and `/mock-to-db`) doesn't clear cached lists, so after a reseed old results can show for up to 5 minutes. That's acceptable for a catalog that only changes through a dev reseed. Each filter combination creates its own key, and they all expire.
- **A Redis failure never breaks the products page.** `getOrSetJson` (`src/shared/cache/cache-json.ts`) catches Redis errors and cached values that fail the `productsResponseSchema` check, reports them with `sendError`, and falls back to the database. This is one of the deliberate local `try/catch` blocks: the cache is an optimization, not a dependency. Route tests use Redis DB 1 (`.env.test`), so they never touch the dev cache.

## Environment variables

- Server env is one Zod schema in `src/shared/config/env.server.ts`, parsed at import time. A missing or malformed `DATABASE_URL` / `REDIS_URL` fails at startup with a clear error instead of at the first query. `import "server-only"` makes a client-component import a build error.
- No env library such as `@t3-oss/env-nextjs`: we only have server variables, and a ten-line Zod module does the same job without another dependency. `server-only` is the only package added.
- `prisma.config.ts` and `prisma/seed.ts` run outside Next.js, so they read `process.env` directly. The seed builds its own `PrismaClient` and passes it to `replaceAllProducts`, because the shared client depends on the server-only env module.
- Tests use Redis database 1 (`redis://localhost:6379/1`) from `.env.test`, so they never touch dev keys in database 0.
