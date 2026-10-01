---
description: Count products per collection in the dev database and store the result in the Redis key "collection-filter"
allowed-tools: Bash(docker compose ps:*), Bash(docker compose up -d postgres redis), Bash(docker compose exec -T postgres psql:*), Bash(docker compose exec -T redis redis-cli:*), Bash(tr -d:*)
---

Build the catalog sidebar's category list (collection name + product count) from the **dev** database and write it to Redis under the key `collection-filter`.

The counts are computed from the `products.collection_id` relation at query time. Don't add a count column to the schema.

## Stored value

A single JSON string:

```json
{
  "total": 26,
  "collections": [{ "id": "col_01", "title": "Audio", "handle": "audio", "count": 6 }]
}
```

- `total` is the "All products" count. It only counts products that have a collection, matching `hasCollection` in `src/features/products/repositories/products.repository.ts`.
- `collections` is ordered by `title`. Collections with no products are included with `count: 0`.

## Steps

1. **Check the services are up.** Run `docker compose ps postgres redis`. If either isn't running and healthy, start them with `docker compose up -d postgres redis` and wait until both show `healthy`.
2. **Query and store in one pipeline.** `psql -tA` prints the JSON as a single line, `tr` strips the trailing newline, and `redis-cli -x` reads stdin as the value for `SET`:

   ```bash
   docker compose exec -T postgres psql -U youleap -d youleap -tA -c "
   SELECT json_build_object(
     'total', (SELECT COUNT(*) FROM products WHERE collection_id IS NOT NULL),
     'collections', COALESCE((
       SELECT json_agg(s ORDER BY s.title)
       FROM (
         SELECT c.id, c.title, c.handle, COUNT(p.id)::int AS count
         FROM collections c
         LEFT JOIN products p ON p.collection_id = c.id
         GROUP BY c.id, c.title, c.handle
       ) s
     ), '[]'::json)
   );" | tr -d '\n' | docker compose exec -T redis redis-cli -x SET collection-filter
   ```

   It must print `OK`. If the `collections` table is empty, stop and suggest running `/mock-to-db` first. Don't write an empty value.

3. **Verify.**
   - Read it back: `docker compose exec -T redis redis-cli GET collection-filter`
   - The value must be valid JSON in the shape above.
   - The sum of every `count` must equal `total`, because every product counted in `total` belongs to exactly one collection.

## Rules

- This command only targets the dev services from `docker-compose.yml`. Never run it against the test database (`.env.test`).
- Only write the `collection-filter` key. Don't run `FLUSHALL`, `FLUSHDB` or `DEL` on other keys.
- The key has no expiry, so run this command again whenever the catalog data changes (for example after `/mock-to-db`).

## Report

Reply with a short summary:

- a table of collection title and count, plus the total
- whether the sum check passed

If anything failed, include the error output.
