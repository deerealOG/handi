"use client";

import { MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * LocationPrompt — Auto-detects user location via browser Geolocation API.
 * Shows a non-intrusive banner if location hasn't been granted yet.
 * Stores lat/lng/address in localStorage once granted.
 */
export default function LocationPrompt() {
  const [visible, setVisible] = useState(false);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    // Check if location is already stored
    const stored = localStorage.getItem("userLocation");
    if (stored) return; // Already have location

    // Check if geolocation is available
    if (!navigator.geolocation) return;

    // Try silent detection first (if permission already granted)
    navigator.permissions
      ?.query({ name: "geolocation" })
      .then((result) => {
        if (result.state === "granted") {
          detectLocation();
        } else if (result.state === "prompt") {
          // Show the prompt banner
          setVisible(true);
        }
        // If denied, don't show anything
      })
      .catch(() => {
        // Fallback: show prompt
        setVisible(true);
      });
  }, []);

  const detectLocation = () => {
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
        };
        localStorage.setItem("userLocation", JSON.stringify(locationData));
        setVisible(false);
        setDetecting(false);
      },
      () => {
        setDetecting(false);
        setVisible(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 z-[60] animate-fadeIn">
      <button
        onClick={() => setVisible(false)}
        className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
      >
        <X size={16} />
      </button>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center shrink-0">
          <MapPin size={20} className="text-[var(--color-primary)]" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">
            Enable location services
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            HANDI uses your location to show nearby providers, verify service
            areas, and ensure quality. Your data is stored securely and never
            shared without consent.
          </p>
          <div className="flex gap-2">
            <button
              onClick={detectLocation}
              disabled={detecting}
              className="flex-1 bg-[var(--color-primary)] text-white py-2 rounded-full text-xs font-semibold hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-60"
            >
              {detecting ? "Detecting..." : "Allow Location"}
            </button>
            <button
              onClick={() => setVisible(false)}
              className="px-4 py-2 rounded-full text-xs font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
