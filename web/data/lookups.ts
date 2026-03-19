import { MOCK_DEALS } from "./deals";
import { MOCK_PRODUCTS } from "./products";
import { MOCK_PROVIDERS } from "./providers-data";
import { MOCK_SERVICES } from "./services";
import type { Deal, Product, Provider, Service } from "./types";

// ================================
// Lookup Functions
// ================================

export function getServiceById(id: string): Service | undefined {
  return MOCK_SERVICES.find((s) => s.id === id);
}

export function getProductById(id: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id);
}

export function getProviderById(id: string): Provider | undefined {
  return MOCK_PROVIDERS.find((p) => p.id === id);
}

export function getDealById(id: string): Deal | undefined {
  return MOCK_DEALS.find((d) => d.id === id);
}

export function getServicesByCategory(category: string): Service[] {
  if (category === "all") return MOCK_SERVICES;
  return MOCK_SERVICES.filter((s) => s.category === category);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return MOCK_PRODUCTS;
  return MOCK_PRODUCTS.filter((p) => p.category === category);
}

export function getProvidersByCategory(category: string): Provider[] {
  if (category === "all" || !category) return MOCK_PROVIDERS;
  return MOCK_PROVIDERS.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase(),
  );
}

export function getServicesByProvider(providerId: string): Service[] {
  return MOCK_SERVICES.filter((s) => s.providerId === providerId);
}

export function searchAll(query: string) {
  const q = query.toLowerCase();
  return {
    services: MOCK_SERVICES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q),
    ),
    products: MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    ),
    providers: MOCK_PROVIDERS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    ),
  };
}
