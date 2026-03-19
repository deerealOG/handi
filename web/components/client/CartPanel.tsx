"use client";

import { useCart } from "@/context/CartContext";
import { MOCK_PRODUCTS, MOCK_SERVICES } from "@/data/mockApi";
import { ChevronLeft, MapPin, Search, ShoppingCart, Store, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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

  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);
  const [deliveryType, setDeliveryType] = useState<"home" | "pickup">("home");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pickupStation, setPickupStation] = useState("");

  const handleAutoDetect = () => {
    // Simulated auto-detect
    setAddress("123 Auto-Detected St, Garki");
    setCity("Abuja");
    setState("Federal Capital Territory");
  };

  const handleCompleteOrder = () => {
    if (deliveryType === "home" && (!address || !city || !state)) {
      alert("Please enter full delivery address or use Auto-Detect.");
      return;
    }
    if (deliveryType === "pickup" && !pickupStation) {
      alert("Please select a pickup station.");
      return;
    }
    // Finalize order
    alert("Order completed successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            {checkoutStep === 2 && (
              <button onClick={() => setCheckoutStep(1)} className="p-1 hover:bg-gray-100 rounded-full mr-1 text-gray-600">
                <ChevronLeft size={20} />
              </button>
            )}
            <h3 className="text-lg font-bold">
              {checkoutStep === 1 ? `My Cart (${cartItems.length})` : "Delivery Options"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {checkoutStep === 1 ? (
            cartItems.length === 0 ? (
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
            )
          ) : (
            // POST-CHECKOUT FLOW: Location Selection
            <div className="space-y-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setDeliveryType("home")}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                    deliveryType === "home" ? "border-primary bg-primary/5 text-primary" : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                  }`}
                >
                  <MapPin size={24} />
                  <span className="text-sm font-semibold">Home Delivery</span>
                </button>
                <button
                  onClick={() => setDeliveryType("pickup")}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                    deliveryType === "pickup" ? "border-primary bg-primary/5 text-primary" : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                  }`}
                >
                  <Store size={24} />
                  <span className="text-sm font-semibold">Pickup Station</span>
                </button>
              </div>

              {deliveryType === "home" ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">Delivery Address</h4>
                    <button onClick={handleAutoDetect} className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors flex items-center gap-1">
                      <Search size={14} /> Auto-detect
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="flex-1 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="flex-1 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <textarea
                    placeholder="Full street address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900">Select Nearest Station</h4>
                  <p className="text-xs text-gray-500 mb-2">Packages will be delivered via our 3rd-party logistics partners to a secure station near you.</p>
                  
                  <select 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    value={pickupStation}
                    onChange={(e) => setPickupStation(e.target.value)}
                  >
                    <option value="" disabled>Select a pickup point...</option>
                    <option value="lagos-ikeja">Ikeja Main Post Office, Lagos</option>
                    <option value="abuja-wuse">Wuse Zone 3 Logistics Hub, Abuja</option>
                    <option value="ph-gra">GRA Phase 2 Drop-off Point, Port Harcourt</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-4 border-t space-y-3 bg-white">
            <div className="flex justify-between text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            
            {checkoutStep === 1 ? (
              <button 
                onClick={() => setCheckoutStep(2)}
                className="w-full py-3.5 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
              >
                Proceed to Checkout
              </button>
            ) : (
              <button 
                onClick={handleCompleteOrder}
                className="w-full py-3.5 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30"
              >
                Complete Payment (₦{subtotal.toLocaleString()})
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
