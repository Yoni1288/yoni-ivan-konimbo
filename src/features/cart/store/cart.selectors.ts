import type { CartLine, CartState } from "../cart.types"
import { getItemCount, getSubtotal } from "../utils/cart-totals"

export const selectCartItems = (state: CartState): CartLine[] => state.items

export const selectIsCartOpen = (state: CartState): boolean => state.isOpen

export const selectCartItemCount = (state: CartState): number => getItemCount(state.items)

export const selectCartSubtotal = (state: CartState): number => getSubtotal(state.items)
