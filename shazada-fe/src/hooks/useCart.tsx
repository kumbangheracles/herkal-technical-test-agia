import { StateContext } from "@/context/StateProvider";
import { useContext } from "react";

export const useCart = () => {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error("useCart must be used inside StateProvider");
  return {
    cart: ctx.cart,
    addToCart: ctx.addToCart,
    removeFromCart: ctx.removeFromCart,
    updateQuantity: ctx.updateQuantity,
    clearCart: ctx.clearCart,
    cartCount: ctx.cartCount,
    cartTotal: ctx.cartTotal,
  };
};
