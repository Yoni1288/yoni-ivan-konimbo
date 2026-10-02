---
description: Point the thumbnail and images of each product in mock-data/products.json at its local photos in public/s3-images
allowed-tools: Bash(pnpm tsx scripts/map-s3-images.ts), Bash(git diff --stat:*), Bash(git diff mock-data/products.json)
---

Update `mock-data/products.json` so each product that has a photo folder in `public/s3-images/<productId>/` uses those photos.

`scripts/map-s3-images.ts` does the actual work. Don't edit the JSON yourself.

## Mapping

For each product with a folder `public/s3-images/<productId>/`:

- `thumbnail.webp` → `"thumbnail": "/s3-images/<productId>/thumbnail.webp"`
- `image_01.webp`, `image_02.webp`, … (also `.jpg`, `.jpeg`, `.png`), sorted by number → `"images": [{ "url": "/s3-images/<productId>/image_01.webp" }, …]`

A product with no folder, or a folder without a thumbnail or `image_NN` files, keeps its current value. The script edits only those two fields, keeps the file's formatting, and aborts without writing if anything else would change. Running it again with no new photos changes nothing.

## Steps

1. **Run the mapping.** Run `pnpm tsx scripts/map-s3-images.ts`. If it fails, stop and report the error. Don't try to fix `products.json` by hand.
2. **Check the diff.** Run `git diff --stat mock-data/products.json`, then `git diff mock-data/products.json`. Confirm that only `"thumbnail"` lines and `"images"` entries changed. If anything else changed, report it and stop.
3. **Remind about the database.** The app reads the catalog from Postgres, not from the JSON file. The new images show only after `/mock-to-db` reseeds the dev database. After that, cached product lists in Redis can show the old URLs for up to 5 minutes. Don't run `/mock-to-db` unless the user asks.

## Rules

- This command is the only sanctioned way to change `mock-data/products.json`, and only its `thumbnail` and `images` fields. Every other prompt must still leave `mock-data/` untouched.
- Don't move, rename, convert or delete files in `public/s3-images/`.

## Report

Reply with a short summary:

- how many products have an image folder, and the script's line for each one
- whether `products.json` changed, with the diff stat
- the reminder to run `/mock-to-db` if it changed
