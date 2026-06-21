// context/StateContext.tsx
"use client";
import { ProductProps } from "@/types/product.type";
import { ProfileProps } from "@/types/profile.type";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
  useEffect,
} from "react";

export type sectionId =
  | "about-us"
  | "home"
  | "contact-us"
  | "motor-list"
  | "tukar-tambah";

export interface CartItem extends ProductProps {
  quantity: number;
}

interface StateProps {
  idSection: sectionId | null;
  setIdSection: Dispatch<SetStateAction<sectionId | null>>;
  dataProfile: ProfileProps | null;
  setDataProfile: Dispatch<SetStateAction<ProfileProps | null>>;
  cart: CartItem[];
  addToCart: (product: ProductProps) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

export const StateContext = createContext<StateProps | null>(null);

const CART_KEY = "motor_cart";

export const StateProvider = ({
  children,
  currentDataProfile,
}: {
  children: ReactNode;
  currentDataProfile: ProfileProps | null;
}) => {
  const router = useRouter();
  const [idSection, setIdSection] = useState<sectionId | null>(null);
  const [dataProfile, setDataProfile] = useState<ProfileProps | null>(
    currentDataProfile,
  );
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        localStorage.removeItem(CART_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    router.refresh();
  }, [currentDataProfile === null]);

  const addToCart = (product: ProductProps) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.quantity,
    0,
  );

  return (
    <StateContext.Provider
      value={{
        setIdSection,
        idSection,
        dataProfile,
        setDataProfile,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
