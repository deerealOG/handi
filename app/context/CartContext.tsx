// context/CartContext.tsx
// Native cart context — track items, add/remove, clear

import React, { createContext, useCallback, useContext, useState } from "react";

// ================================
// Types
// ================================
export interface CartItem {
  id: string | number;
  name: string;
  price: number; // in naira/units
  image?: string;
  quantity: number;
  category?: string;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
}

// ================================
// Context
// ================================
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const addItem = useCallback(
    (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === newItem.id);
        if (existing) {
          return prev.map((i) =>
            i.id === newItem.id
              ? { ...i, quantity: i.quantity + (newItem.quantity ?? 1) }
              : i,
          );
        }
        return [...prev, { ...newItem, quantity: newItem.quantity ?? 1 }];
      });
    },
    [],
  );

  const removeItem = useCallback((id: string | number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback(
    (id: string | number, quantity: number) => {
      if (quantity <= 0) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, quantity } : i)),
        );
      }
    },
    [],
  );

  const clearCart = useCallback(() => setItems([]), []);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ================================
// Hook
// ================================
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
