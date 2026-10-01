import type { CartLine, CartState } from "../cart.types"
import { getItemCount, getSubtotal } from "../utils/cart-totals"

// The catalog is single-currency, so an empty cart still formats in the store currency.
const FALLBACK_CURRENCY_CODE: string = "ILS"

export const selectCartItems = (state: CartState): CartLine[] => state.items

export const selectIsCartOpen = (state: CartState): boolean => state.isOpen

export const selectCartItemCount = (state: CartState): number => getItemCount(state.items)

export const selectCartSubtotal = (state: CartState): number => getSubtotal(state.items)

export const selectCartCurrencyCode = (state: CartState): string => state.items[0]?.currencyCode ?? FALLBACK_CURRENCY_CODE
