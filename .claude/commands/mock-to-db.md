---
description: Wipe the dev database's catalog data, reinsert it from mock-data/products.json and ensure the admin user exists
allowed-tools: Bash(docker compose ps:*), Bash(docker compose up -d postgres), Bash(docker compose exec -T postgres psql:*), Bash(pnpm prisma migrate deploy), Bash(pnpm prisma db seed), Bash(node -e:*)
---

Reset the **dev** database so its catalog data exactly matches `mock-data/products.json`, and make sure the admin user exists.

`prisma/seed.ts` does the actual work. Don't write your own SQL for this.

- **Catalog:** in one transaction, `replaceAllProducts` (`src/features/products/repositories/products-seed.repository.ts`) deletes every row from all catalog tables and reinserts the mock data.
- **Admin user:** `upsertAdminUser` (`src/features/auth/repositories/users-seed.repository.ts`) creates or updates the user named by `SEED_ADMIN_USERNAME`, with `SEED_ADMIN_PASSWORD` hashed (scrypt) and `SEED_ADMIN_EMAIL`, all from `.env`. It never deletes users, and never touches `orders` or `order_items`.

## Steps

1. **Check the database is up.** Run `docker compose ps postgres`. If it isn't running and healthy, start it with `docker compose up -d postgres` and wait until the status shows `healthy`.
2. **Bring the schema up to date.** Run `pnpm prisma migrate deploy`. If it fails, stop and report the error. Don't run `prisma migrate reset` or edit migrations.
3. **Replace the data.** Run `pnpm prisma db seed`. It should log `Seeded <N> products.` and `Seeded admin user "<username>".`
   - If it fails with a Zod error about `SEED_ADMIN_*`, the admin variables are missing or invalid in `.env`. Stop and ask the user to add them (see `.env.example`). Don't invent values or edit `.env` yourself. Nothing was written in that case, because the seed validates them first.
4. **Verify.**
   - Count the products in the mock file: `node -e 'console.log(require("./mock-data/products.json").length)'`
   - Query the database: `docker compose exec -T postgres psql -U youleap -d youleap -tA -c "<query>"` with a query that counts rows in `collections`, `products`, `product_images`, `tags`, `product_tags`, `product_options`, `product_option_values`, `variants`, `variant_option_values`, `variant_prices`, `users`, `orders` and `order_items`.
   - The `products` count must equal the mock count.
   - Every variant must link to one option value per product option. This query must return 0 rows:

     ```sql
     SELECT v.id FROM variants v
     JOIN product_options o ON o.product_id = v.product_id
     LEFT JOIN variant_option_values l ON l.variant_id = v.id
       AND l.option_value_id IN (SELECT id FROM product_option_values WHERE option_id = o.id)
     WHERE l.variant_id IS NULL;
     ```

   - The admin user must exist with a hashed password. Using the username from the seed log line, this must return `1`:

     ```sql
     SELECT count(*) FROM users WHERE user_name = '<username>' AND password_hash LIKE 'scrypt$%';
     ```

## Rules

- This command only targets the dev database from `.env`. Never run it against the test database (`.env.test`) or set `DATABASE_URL` yourself.
- Don't modify `mock-data/products.json`.
- Never print the admin password, the `SEED_ADMIN_PASSWORD` value or any `password_hash`. Don't `cat` or `grep` `.env` to show them.

## Report

Reply with a short summary:

- whether the migrations were already up to date
- both seed log lines
- a table of row counts per table
- whether the checks passed, including the admin user check (username only)

If anything failed, include the error output.
