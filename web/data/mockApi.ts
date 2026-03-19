// data/mockApi.ts
// Re-export hub — all imports from @/data/mockApi still work
// Individual modules can also be imported directly for smaller bundles

// Types
export type {
    CACCertificate, Certification, Deal,
    FlashDeal, NextOfKin, Product,
    Provider, Service, ServiceCategory, User, WorkExperience
} from "./types";

// Data
export { PRODUCT_CATEGORIES, SERVICE_CATEGORIES } from "./categories";
export { MOCK_DEALS } from "./deals";
export { MOCK_FLASH_DEALS } from "./flash-deals";
export { MOCK_PRODUCTS } from "./products";
export { MOCK_PROVIDERS } from "./providers-data";
export { MOCK_SERVICES } from "./services";
export { MOCK_USERS } from "./users";

// Lookup functions
export {
    getDealById, getProductById, getProductsByCategory, getProviderById, getProvidersByCategory, getServiceById, getServicesByCategory, getServicesByProvider,
    searchAll
} from "./lookups";

