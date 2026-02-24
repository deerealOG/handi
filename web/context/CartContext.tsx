"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

// ================================
// Types
// ================================
export interface CartItem {
  id: string;
  type: "service" | "product";
  quantity: number;
}

interface CartContextType {
  // Cart
  cartItems: CartItem[];
  addToCart: (
    id: string,
    type: "service" | "product",
    quantity?: number,
    maxStock?: number,
  ) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number, maxStock?: number) => void;
  clearCart: () => void;
  cartCount: number;

  // Wishlist
  wishlistItems: string[];
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  wishlistCount: number;

  // Toast notification
  toast: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ================================
// Provider
// ================================
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("handi_cart");
      if (storedCart) setCartItems(JSON.parse(storedCart));
      const storedWishlist = localStorage.getItem("handi_wishlist");
      if (storedWishlist) setWishlistItems(JSON.parse(storedWishlist));
    } catch {
      // ignore corrupt data
    }
  }, []);

  // Persist cart
  useEffect(() => {
    localStorage.setItem("handi_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Persist wishlist
  useEffect(() => {
    localStorage.setItem("handi_wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Auto-clear toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  // ---- Cart actions ----
  const addToCart = useCallback(
    (
      id: string,
      type: "service" | "product",
      quantity = 1,
      maxStock?: number,
    ) => {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === id);
        if (existing) {
          const newQty = existing.quantity + quantity;
          if (maxStock !== undefined && newQty > maxStock) {
            setToast(`Maximum stock (${maxStock}) reached`);
            return prev.map((item) =>
              item.id === id ? { ...item, quantity: maxStock } : item,
            );
          }
          return prev.map((item) =>
            item.id === id ? { ...item, quantity: newQty } : item,
          );
        }
        return [...prev, { id, type, quantity }];
      });
      setToast("Added to cart ✓");
    },
    [],
  );

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    setToast("Removed from cart");
  }, []);

  const updateQuantity = useCallback(
    (id: string, quantity: number, maxStock?: number) => {
      if (quantity <= 0) {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        return;
      }
      if (maxStock !== undefined && quantity > maxStock) {
        setToast(`Maximum stock (${maxStock}) reached`);
        return;
      }
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
      );
    },
    [],
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    setToast("Cart cleared");
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ---- Wishlist actions ----
  const toggleWishlist = useCallback((id: string) => {
    setWishlistItems((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        setToast("Removed from wishlist");
        return prev.filter((item) => item !== id);
      }
      setToast("Added to wishlist ♥");
      return [...prev, id];
    });
  }, []);

  const isInWishlist = useCallback(
    (id: string) => wishlistItems.includes(id),
    [wishlistItems],
  );

  const wishlistCount = wishlistItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
        toast,
      }}
    >
      {children}
      {/* Global toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] animate-[slideUp_0.3s_ease-out]">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium">
            {toast}
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

// ================================
// Hook
// ================================
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
