"use client";

import { useCart } from "@/context/CartContext";
import { MOCK_PRODUCTS, MOCK_SERVICES } from "@/data/mockApi";
import { ShoppingCart, Trash2, X } from "lucide-react";
import Image from "next/image";

export default function CartPanel({ onClose }: { onClose: () => void }) {
  const { cartItems, removeFromCart, addToCart } = useCart();
  const products = MOCK_PRODUCTS;
  const services = MOCK_SERVICES;

  const getItemDetails = (item: {
    id: string;
    type: string;
    quantity: number;
  }) => {
    if (item.type === "product") {
      const p = products.find((x) => x.id === item.id);
      return p ? { name: p.name, price: p.price, image: p.image } : null;
    }
    const s = services.find((x) => x.id === item.id);
    return s ? { name: s.name, price: s.price, image: s.image } : null;
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const d = getItemDetails(item);
    return sum + (d ? d.price * item.quantity : 0);
  }, 0);

  return (
    <div className="fixed inset-0 z-60 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold">My Cart ({cartItems.length})</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart size={48} className="mb-3 opacity-50" />
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm mt-1">
                Browse services and products to add items
              </p>
            </div>
          ) : (
            cartItems.map((item) => {
              const d = getItemDetails(item);
              if (!d) return null;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <div className="w-14 h-14 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                    {d.image && (
                      <Image
                        src={d.image}
                        alt=""
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {d.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {item.type}
                    </p>
                    <p className="text-sm font-bold text-green-700 mt-0.5">
                      ₦{(d.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        addToCart(
                          item.id,
                          item.type as "service" | "product",
                          -1,
                        )
                      }
                      className="w-7 h-7 rounded-full bg-gray-200 text-sm font-bold flex items-center justify-center hover:bg-gray-300"
                    >
                      −
                    </button>
                    <span className="text-sm w-6 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        addToCart(
                          item.id,
                          item.type as "service" | "product",
                          1,
                        )
                      }
                      className="w-7 h-7 rounded-full bg-gray-200 text-sm font-bold flex items-center justify-center hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="p-4 border-t space-y-3">
            <div className="flex justify-between text-sm font-bold text-gray-900">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <button className="w-full py-3 bg-(--color-primary) text-white rounded-full font-semibold hover:bg-(--color-primary-dark) transition-colors">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
