export type CartLine = {
  variantId: string
  productId: string
  title: string
  variantTitle: string
  thumbnail: string
  unitPrice: number
  currencyCode: string
  inventoryQuantity: number
  quantity: number
}

export type NewCartLine = Omit<CartLine, "quantity">

export type CartState = {
  items: CartLine[]
  isOpen: boolean
  addItem: (line: NewCartLine, quantity: number) => void
  updateQuantity: (variantId: string, quantity: number) => void
  removeItem: (variantId: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

export type CartLineItemProps = {
  line: CartLine
  index: number
}

export type CartEmptyStateProps = {
  onStartShopping: () => void
}

export type CartSummaryProps = {
  subtotal: number
  currencyCode: string
  onContinueShopping: () => void
}
