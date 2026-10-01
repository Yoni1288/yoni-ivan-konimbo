-- Added as nullable, backfilled from the cheapest variant price, then made required, so existing rows don't block the migration.
ALTER TABLE "products" ADD COLUMN "min_price" INTEGER;

UPDATE "products" SET "min_price" = COALESCE(
  (SELECT MIN(vp."amount") FROM "variants" v JOIN "variant_prices" vp ON vp."variant_id" = v."id" WHERE v."product_id" = "products"."id"),
  0
);

ALTER TABLE "products" ALTER COLUMN "min_price" SET NOT NULL;
