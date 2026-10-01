-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "images" JSONB NOT NULL,
    "variants" JSONB NOT NULL,
    "options" JSONB NOT NULL,
    "tags" JSONB NOT NULL,
    "collection" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_handle_key" ON "products"("handle");

