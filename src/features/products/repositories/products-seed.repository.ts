import type { Prisma, PrismaClient } from "@/generated/prisma/client"
import type { Product, ProductOption, ProductVariant } from "@/types/product"
import { getLowestPrice } from "../utils/product-display"

const REPLACE_TIMEOUT_MS: number = 30_000

const toProductCreateInput = (product: Product): Prisma.ProductCreateInput => {
  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    thumbnail: product.thumbnail,
    createdAt: new Date(product.created_at),
    minPrice: getLowestPrice(product)?.amount ?? 0,
    collection: { connectOrCreate: { where: { id: product.collection.id }, create: product.collection } },
    images: { create: product.images.map((image, index) => ({ url: image.url, position: index })) },
    tags: { create: product.tags.map((tag) => ({ tag: { connectOrCreate: { where: { value: tag.value }, create: { value: tag.value } } } })) },
    options: {
      create: product.options.map((option, index) => ({
        id: option.id,
        title: option.title,
        position: index,
        values: { create: option.values.map((value) => ({ value })) },
      })),
    },
  }
}

// Mock variants carry no option values, only a title whose " - " parts follow the options order.
// Extra parts without a matching option (prod_14: option Size, title "EU 42 - Black") are ignored.
const toVariantOptionLinks = (options: ProductOption[], variantTitle: string): Prisma.VariantOptionValueCreateWithoutVariantInput[] => {
  const titleParts: string[] = variantTitle.split(" - ")
  return options.map((option, index) => ({
    optionValue: { connect: { optionId_value: { optionId: option.id, value: titleParts[index] } } },
  }))
}

const toVariantCreateInput = (product: Product, variant: ProductVariant): Prisma.VariantCreateInput => {
  return {
    id: variant.id,
    title: variant.title,
    sku: variant.sku,
    inventoryQuantity: variant.inventory_quantity,
    product: { connect: { id: product.id } },
    prices: { create: variant.prices.map((price) => ({ amount: price.amount, currencyCode: price.currency_code })) },
    optionValues: { create: toVariantOptionLinks(product.options, variant.title) },
  }
}

const createProduct = async (tx: Prisma.TransactionClient, product: Product): Promise<void> => {
  await tx.product.create({ data: toProductCreateInput(product) })

  // Variants are created after the product so their option values already exist to link to.
  for (const variant of product.variants) {
    await tx.variant.create({ data: toVariantCreateInput(product, variant) })
  }
}

// Takes the client as a parameter because the seed runs outside Next.js and can't import the shared client (it depends on the server-only env module).
export const replaceAllProducts = async (client: PrismaClient, products: Product[]): Promise<void> => {
  await client.$transaction(
    async (tx: Prisma.TransactionClient): Promise<void> => {
      await tx.product.deleteMany()
      await tx.tag.deleteMany()
      await tx.collection.deleteMany()

      for (const product of products) {
        await createProduct(tx, product)
      }
    },
    { timeout: REPLACE_TIMEOUT_MS }
  )
}
