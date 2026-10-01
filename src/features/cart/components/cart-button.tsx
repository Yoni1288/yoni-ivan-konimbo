"use client"

import { ShoppingBag } from "lucide-react"
import { useCartHydration } from "../hooks/use-cart-hydration"
import { selectCartItemCount, selectIsCartOpen } from "../store/cart.selectors"
import { useCartStore } from "../store/cart.store"
import { CartDrawer } from "./cart-drawer"

export const CartButton = (): React.JSX.Element => {
  useCartHydration()
  const itemCount: number = useCartStore(selectCartItemCount)
  const isOpen: boolean = useCartStore(selectIsCartOpen)
  const openCart: () => void = useCartStore((state) => state.openCart)

  return (
    <>
      <button type="button" aria-label={`Cart, ${itemCount} items`} onClick={openCart} className="relative flex size-11 items-center justify-center rounded-full hover:bg-black/5">
        <ShoppingBag className="size-5" strokeWidth={1.5} />
        <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-ink text-2xs font-medium text-white">{itemCount}</span>
      </button>
      {isOpen && <CartDrawer />}
    </>
  )
}
