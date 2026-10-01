---
description: Wipe the dev database's catalog data and reinsert it from mock-data/products.json
allowed-tools: Bash(docker compose ps:*), Bash(docker compose up -d postgres), Bash(docker compose exec -T postgres psql:*), Bash(pnpm prisma migrate deploy), Bash(pnpm prisma db seed), Bash(node -e:*)
---

Reset the **dev** database so its catalog data exactly matches `mock-data/products.json`.

`prisma/seed.ts` does the actual work. In one transaction, `replaceAllProducts` (`src/features/products/repositories/products-seed.repository.ts`) deletes every row from all catalog tables and reinserts the mock data. Don't write your own SQL for this.

## Steps

1. **Check the database is up.** Run `docker compose ps postgres`. If it isn't running and healthy, start it with `docker compose up -d postgres` and wait until the status shows `healthy`.
2. **Bring the schema up to date.** Run `pnpm prisma migrate deploy`. If it fails, stop and report the error. Don't run `prisma migrate reset` or edit migrations.
3. **Replace the data.** Run `pnpm prisma db seed`. It should log `Seeded <N> products.`
4. **Verify.**
   - Count the products in the mock file: `node -e 'console.log(require("./mock-data/products.json").length)'`
   - Query the database: `docker compose exec -T postgres psql -U youleap -d youleap -tA -c "<query>"` with a query that counts rows in `collections`, `products`, `product_images`, `tags`, `product_tags`, `product_options`, `product_option_values`, `variants`, `variant_option_values` and `variant_prices`.
   - The `products` count must equal the mock count.
   - Every variant must link to one option value per product option. This query must return 0 rows:

     ```sql
     SELECT v.id FROM variants v
     JOIN product_options o ON o.product_id = v.product_id
     LEFT JOIN variant_option_values l ON l.variant_id = v.id
       AND l.option_value_id IN (SELECT id FROM product_option_values WHERE option_id = o.id)
     WHERE l.variant_id IS NULL;
     ```

## Rules

- This command only targets the dev database from `.env`. Never run it against the test database (`.env.test`) or set `DATABASE_URL` yourself.
- Don't modify `mock-data/products.json`.

## Report

Reply with a short summary:

- whether the migrations were already up to date
- the seed log line
- a table of row counts per table
- whether the checks passed

If anything failed, include the error output.
