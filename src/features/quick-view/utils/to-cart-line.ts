import type { NewCartLine } from "@/features/cart/cart.types"
import type { Price, Product, ProductVariant } from "@/types/product"

export const toCartLine = (product: Product, variant: ProductVariant, price: Price): NewCartLine => {
  return {
    variantId: variant.id,
    productId: product.id,
    title: product.title,
    variantTitle: variant.title,
    thumbnail: product.thumbnail,
    unitPrice: price.amount,
    currencyCode: price.currency_code,
    inventoryQuantity: variant.inventory_quantity,
  }
}
