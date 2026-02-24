"use client";

import { useCart } from "@/context/CartContext";
import { MOCK_PRODUCTS, MOCK_SERVICES } from "@/data/mockApi";
import { Heart, Trash2, X } from "lucide-react";
import Image from "next/image";

export default function WishlistPanel({ onClose }: { onClose: () => void }) {
  const { wishlistItems, toggleWishlist, addToCart } = useCart();
  const products = MOCK_PRODUCTS;
  const services = MOCK_SERVICES;

  const getItemDetails = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (p)
      return {
        name: p.name,
        price: p.price,
        image: p.image,
        type: "product" as const,
      };
    const s = services.find((x) => x.id === id);
    if (s)
      return {
        name: s.name,
        price: s.price,
        image: s.image,
        type: "service" as const,
      };
    return null;
  };

  return (
    <div className="fixed inset-0 z-60 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold">
            My Wishlist ({wishlistItems.length})
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Heart size={48} className="mb-3 opacity-50" />
              <p className="font-medium">Your wishlist is empty</p>
              <p className="text-sm mt-1">Save items you love for later</p>
            </div>
          ) : (
            wishlistItems.map((id) => {
              const d = getItemDetails(id);
              if (!d) return null;
              return (
                <div
                  key={id}
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
                    <p className="text-xs text-gray-500 capitalize">{d.type}</p>
                    <p className="text-sm font-bold text-green-700 mt-0.5">
                      ₦{d.price.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(id, d.type, 1);
                      toggleWishlist(id);
                    }}
                    className="px-3 py-1.5 bg-(--color-primary) text-white text-xs rounded-full font-semibold hover:bg-(--color-primary-dark)"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => toggleWishlist(id)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
