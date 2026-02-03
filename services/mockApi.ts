// services/mockApi.ts
// Comprehensive mock API for HANDI app - Nigerian market

// ================================
// Types
// ================================
export interface Provider {
  id: string;
  name: string;
  profession: string;
  rating: number;
  reviews: number;
  location: string;
  price: string;
  isOnline: boolean;
  isVerified: boolean;
  avatar?: string;
  skills: string[];
  bio: string;
  completedJobs: number;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  provider: string;
  location: string;
  image?: string;
  description: string;
  duration: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  seller: string;
  location: string;
  image?: string;
  inStock: boolean;
  quantity: number;
}

export interface SearchResult {
  providers: Provider[];
  services: Service[];
  products: Product[];
  totalResults: number;
}

// ================================
// Nigerian Cities & States
// ================================
export const NIGERIAN_LOCATIONS = {
  states: [
    "Lagos",
    "Abuja (FCT)",
    "Rivers",
    "Kano",
    "Oyo",
    "Kaduna",
    "Enugu",
    "Delta",
    "Ogun",
    "Anambra",
    "Edo",
    "Imo",
    "Kwara",
    "Osun",
    "Ekiti",
  ],
  cities: {
    Lagos: [
      "Ikeja",
      "Lekki",
      "Victoria Island",
      "Surulere",
      "Yaba",
      "Ikoyi",
      "Ajah",
      "Gbagada",
      "Maryland",
      "Ogba",
    ],
    "Abuja (FCT)": [
      "Wuse",
      "Garki",
      "Maitama",
      "Asokoro",
      "Gwarinpa",
      "Kubwa",
      "Nyanya",
      "Lugbe",
    ],
    Rivers: ["Port Harcourt", "Obio-Akpor", "Eleme", "Bonny"],
    Oyo: ["Ibadan", "Ogbomoso", "Oyo", "Iseyin"],
    Kano: ["Kano Municipal", "Nassarawa", "Tarauni", "Fagge"],
  },
};

// ================================
// Mock Data - Providers
// ================================
const MOCK_PROVIDERS: Provider[] = [
  {
    id: "p1",
    name: "Chinedu Okonkwo",
    profession: "Electrician",
    rating: 4.9,
    reviews: 127,
    location: "Ikeja, Lagos",
    price: "₦5,000/hr",
    isOnline: true,
    isVerified: true,
    avatar: "https://i.pravatar.cc/150?img=12",
    skills: [
      "Wiring",
      "AC Installation",
      "Generator Repair",
      "Solar Installation",
    ],
    bio: "Experienced electrician with 10+ years in residential and commercial projects.",
    completedJobs: 342,
  },
  {
    id: "p2",
    name: "Adaeze Nnamdi",
    profession: "Hair Stylist",
    rating: 4.8,
    reviews: 89,
    location: "Lekki, Lagos",
    price: "₦8,000/session",
    isOnline: true,
    isVerified: true,
    avatar: "https://i.pravatar.cc/150?img=26",
    skills: ["Braiding", "Weaving", "Natural Hair", "Styling"],
    bio: "Professional hair stylist specializing in African hairstyles and modern trends.",
    completedJobs: 215,
  },
  {
    id: "p3",
    name: "Emeka Ugochukwu",
    profession: "Plumber",
    rating: 4.7,
    reviews: 64,
    location: "Victoria Island, Lagos",
    price: "₦4,500/hr",
    isOnline: false,
    isVerified: true,
    avatar: "https://i.pravatar.cc/150?img=15",
    skills: ["Pipe Fitting", "Drainage", "Water Heater", "Pump Installation"],
    bio: "Certified plumber handling all residential and commercial plumbing needs.",
    completedJobs: 189,
  },
  {
    id: "p4",
    name: "Fatima Abdullahi",
    profession: "House Cleaner",
    rating: 4.9,
    reviews: 156,
    location: "Wuse, Abuja",
    price: "₦3,500/hr",
    isOnline: true,
    isVerified: true,
    avatar: "https://i.pravatar.cc/150?img=32",
    skills: ["Deep Cleaning", "Laundry", "Organization", "Office Cleaning"],
    bio: "Meticulous cleaner with attention to detail. I make your space sparkle!",
    completedJobs: 478,
  },
  {
    id: "p5",
    name: "Oluwaseun Bakare",
    profession: "Carpenter",
    rating: 4.6,
    reviews: 45,
    location: "Ibadan, Oyo",
    price: "₦6,000/hr",
    isOnline: true,
    isVerified: false,
    avatar: "https://i.pravatar.cc/150?img=17",
    skills: [
      "Furniture Making",
      "Wood Repair",
      "Cabinet Installation",
      "Roofing",
    ],
    bio: "Skilled carpenter crafting quality furniture and woodwork for over 8 years.",
    completedJobs: 98,
  },
  {
    id: "p6",
    name: "Ngozi Eze",
    profession: "Makeup Artist",
    rating: 4.8,
    reviews: 112,
    location: "Port Harcourt, Rivers",
    price: "₦15,000/session",
    isOnline: true,
    isVerified: true,
    avatar: "https://i.pravatar.cc/150?img=29",
    skills: ["Bridal Makeup", "Editorial", "Special Effects", "Training"],
    bio: "Celebrity makeup artist with experience in weddings and fashion shows.",
    completedJobs: 267,
  },
];

// ================================
// Mock Data - Services
// ================================
const MOCK_SERVICES: Service[] = [
  {
    id: "s1",
    name: "Home Electrical Wiring",
    category: "Electrical",
    price: 25000,
    originalPrice: 30000,
    rating: 4.8,
    reviews: 89,
    provider: "Chinedu Okonkwo",
    location: "Lagos",
    description:
      "Complete home wiring and rewiring services for apartments and houses.",
    duration: "2-4 hours",
  },
  {
    id: "s2",
    name: "AC Installation & Repair",
    category: "Electrical",
    price: 15000,
    rating: 4.7,
    reviews: 56,
    provider: "Chinedu Okonkwo",
    location: "Lagos",
    description:
      "Professional AC installation, servicing, and repair for all brands.",
    duration: "1-2 hours",
  },
  {
    id: "s3",
    name: "African Braids Package",
    category: "Beauty",
    price: 12000,
    originalPrice: 15000,
    rating: 4.9,
    reviews: 134,
    provider: "Adaeze Nnamdi",
    location: "Lagos",
    description:
      "Beautiful African braiding styles including cornrows, box braids, and twists.",
    duration: "3-5 hours",
  },
  {
    id: "s4",
    name: "Deep House Cleaning",
    category: "Cleaning",
    price: 18000,
    rating: 4.8,
    reviews: 201,
    provider: "Fatima Abdullahi",
    location: "Abuja",
    description: "Thorough deep cleaning service for homes up to 3 bedrooms.",
    duration: "4-6 hours",
  },
  {
    id: "s5",
    name: "Plumbing Repair",
    category: "Plumbing",
    price: 8000,
    rating: 4.6,
    reviews: 45,
    provider: "Emeka Ugochukwu",
    location: "Lagos",
    description: "Fix leaky pipes, blocked drains, and other plumbing issues.",
    duration: "1-3 hours",
  },
  {
    id: "s6",
    name: "Bridal Makeup Package",
    category: "Beauty",
    price: 45000,
    rating: 4.9,
    reviews: 78,
    provider: "Ngozi Eze",
    location: "Port Harcourt",
    description:
      "Complete bridal makeup with trial session and wedding day application.",
    duration: "5-6 hours",
  },
];

// ================================
// Mock Data - Products
// ================================
const MOCK_PRODUCTS: Product[] = [
  {
    id: "pr1",
    name: 'QASA Ceiling Fan 56"',
    category: "Electronics",
    price: 28000,
    originalPrice: 32000,
    rating: 4.5,
    reviews: 89,
    seller: "TechWorld Lagos",
    location: "Ikeja, Lagos",
    inStock: true,
    quantity: 25,
  },
  {
    id: "pr2",
    name: "Hisense 1.5HP Split AC",
    category: "Electronics",
    price: 185000,
    rating: 4.7,
    reviews: 156,
    seller: "CoolZone Nigeria",
    location: "Victoria Island, Lagos",
    inStock: true,
    quantity: 8,
  },
  {
    id: "pr3",
    name: "Premium Hair Extensions",
    category: "Beauty",
    price: 45000,
    originalPrice: 55000,
    rating: 4.8,
    reviews: 234,
    seller: "GlamHair NG",
    location: "Lekki, Lagos",
    inStock: true,
    quantity: 50,
  },
  {
    id: "pr4",
    name: "Cleaning Supplies Bundle",
    category: "Home",
    price: 12500,
    rating: 4.4,
    reviews: 67,
    seller: "CleanHome Store",
    location: "Wuse, Abuja",
    inStock: true,
    quantity: 100,
  },
  {
    id: "pr5",
    name: "Plumbing Tools Kit",
    category: "Tools",
    price: 35000,
    rating: 4.6,
    reviews: 45,
    seller: "ToolMaster Nigeria",
    location: "Surulere, Lagos",
    inStock: false,
    quantity: 0,
  },
  {
    id: "pr6",
    name: "Bridal Makeup Kit",
    category: "Beauty",
    price: 28000,
    originalPrice: 35000,
    rating: 4.7,
    reviews: 89,
    seller: "BeautyPro NG",
    location: "Port Harcourt, Rivers",
    inStock: true,
    quantity: 15,
  },
];

// ================================
// Categories
// ================================
export const SERVICE_CATEGORIES = [
  { id: "all", name: "All", icon: "apps" },
  { id: "electrical", name: "Electrical", icon: "flash" },
  { id: "plumbing", name: "Plumbing", icon: "pipe" },
  { id: "beauty", name: "Beauty", icon: "face-woman" },
  { id: "cleaning", name: "Cleaning", icon: "broom" },
  { id: "carpentry", name: "Carpentry", icon: "hammer" },
  { id: "painting", name: "Painting", icon: "format-paint" },
  { id: "ac-repair", name: "AC Repair", icon: "air-conditioner" },
  { id: "generator", name: "Generator", icon: "engine" },
  { id: "mechanic", name: "Mechanic", icon: "car-wrench" },
  { id: "tailoring", name: "Tailoring", icon: "scissors-cutting" },
  { id: "catering", name: "Catering", icon: "food" },
];

// ================================
// API Simulation Helpers
// ================================
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const simulateNetworkDelay = async () => {
  await delay(300 + Math.random() * 500); // 300-800ms
};

// ================================
// Mock API Functions
// ================================

/**
 * Search across providers, services, and products
 */
export async function searchAll(
  query: string,
  filters?: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
  },
): Promise<SearchResult> {
  await simulateNetworkDelay();

  const lowerQuery = query.toLowerCase();

  let providers = MOCK_PROVIDERS.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.profession.toLowerCase().includes(lowerQuery) ||
      p.skills.some((s) => s.toLowerCase().includes(lowerQuery)),
  );

  let services = MOCK_SERVICES.filter(
    (s) =>
      s.name.toLowerCase().includes(lowerQuery) ||
      s.category.toLowerCase().includes(lowerQuery) ||
      s.description.toLowerCase().includes(lowerQuery),
  );

  let products = MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery),
  );

  // Apply filters
  if (filters?.location) {
    const loc = filters.location.toLowerCase();
    providers = providers.filter((p) => p.location.toLowerCase().includes(loc));
    services = services.filter((s) => s.location.toLowerCase().includes(loc));
    products = products.filter((p) => p.location.toLowerCase().includes(loc));
  }

  if (filters?.category && filters.category !== "all") {
    const cat = filters.category.toLowerCase();
    services = services.filter((s) => s.category.toLowerCase() === cat);
    products = products.filter((p) => p.category.toLowerCase() === cat);
  }

  if (filters?.minPrice) {
    services = services.filter((s) => s.price >= filters.minPrice!);
    products = products.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters?.maxPrice) {
    services = services.filter((s) => s.price <= filters.maxPrice!);
    products = products.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters?.rating) {
    providers = providers.filter((p) => p.rating >= filters.rating!);
    services = services.filter((s) => s.rating >= filters.rating!);
    products = products.filter((p) => p.rating >= filters.rating!);
  }

  return {
    providers,
    services,
    products,
    totalResults: providers.length + services.length + products.length,
  };
}

/**
 * Get all providers with optional filters
 */
export async function getProviders(filters?: {
  profession?: string;
  location?: string;
  isOnline?: boolean;
  isVerified?: boolean;
  minRating?: number;
}): Promise<Provider[]> {
  await simulateNetworkDelay();

  let result = [...MOCK_PROVIDERS];

  if (filters?.profession) {
    result = result.filter((p) =>
      p.profession.toLowerCase().includes(filters.profession!.toLowerCase()),
    );
  }

  if (filters?.location) {
    result = result.filter((p) =>
      p.location.toLowerCase().includes(filters.location!.toLowerCase()),
    );
  }

  if (filters?.isOnline !== undefined) {
    result = result.filter((p) => p.isOnline === filters.isOnline);
  }

  if (filters?.isVerified !== undefined) {
    result = result.filter((p) => p.isVerified === filters.isVerified);
  }

  if (filters?.minRating) {
    result = result.filter((p) => p.rating >= filters.minRating!);
  }

  return result;
}

/**
 * Get provider by ID
 */
export async function getProviderById(id: string): Promise<Provider | null> {
  await simulateNetworkDelay();
  return MOCK_PROVIDERS.find((p) => p.id === id) || null;
}

/**
 * Get all services with optional filters
 */
export async function getServices(filters?: {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}): Promise<Service[]> {
  await simulateNetworkDelay();

  let result = [...MOCK_SERVICES];

  if (filters?.category && filters.category !== "all") {
    result = result.filter(
      (s) => s.category.toLowerCase() === filters.category!.toLowerCase(),
    );
  }

  if (filters?.location) {
    result = result.filter((s) =>
      s.location.toLowerCase().includes(filters.location!.toLowerCase()),
    );
  }

  if (filters?.minPrice) {
    result = result.filter((s) => s.price >= filters.minPrice!);
  }

  if (filters?.maxPrice) {
    result = result.filter((s) => s.price <= filters.maxPrice!);
  }

  if (filters?.minRating) {
    result = result.filter((s) => s.rating >= filters.minRating!);
  }

  return result;
}

/**
 * Get service by ID
 */
export async function getServiceById(id: string): Promise<Service | null> {
  await simulateNetworkDelay();
  return MOCK_SERVICES.find((s) => s.id === id) || null;
}

/**
 * Get all products with optional filters
 */
export async function getProducts(filters?: {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}): Promise<Product[]> {
  await simulateNetworkDelay();

  let result = [...MOCK_PRODUCTS];

  if (filters?.category && filters.category !== "all") {
    result = result.filter(
      (p) => p.category.toLowerCase() === filters.category!.toLowerCase(),
    );
  }

  if (filters?.location) {
    result = result.filter((p) =>
      p.location.toLowerCase().includes(filters.location!.toLowerCase()),
    );
  }

  if (filters?.minPrice) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters?.maxPrice) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters?.inStock !== undefined) {
    result = result.filter((p) => p.inStock === filters.inStock);
  }

  return result;
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  await simulateNetworkDelay();
  return MOCK_PRODUCTS.find((p) => p.id === id) || null;
}

/**
 * Book a service
 */
export async function bookService(data: {
  serviceId: string;
  providerId: string;
  date: string;
  time: string;
  address: string;
  notes?: string;
}): Promise<{ success: boolean; bookingId: string; message: string }> {
  await simulateNetworkDelay();

  // Simulate successful booking
  return {
    success: true,
    bookingId: `BK${Date.now()}`,
    message:
      "Service booked successfully! The provider will contact you shortly.",
  };
}

/**
 * Add product to cart
 */
export async function addToCart(data: {
  productId: string;
  quantity: number;
}): Promise<{ success: boolean; cartCount: number; message: string }> {
  await simulateNetworkDelay();

  return {
    success: true,
    cartCount: data.quantity,
    message: "Product added to cart!",
  };
}

/**
 * Submit contact form / newsletter signup
 */
export async function submitContactForm(data: {
  email: string;
  name?: string;
  message?: string;
  type: "newsletter" | "contact" | "support";
}): Promise<{ success: boolean; message: string }> {
  await simulateNetworkDelay();

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  return {
    success: true,
    message:
      data.type === "newsletter"
        ? "Thank you for subscribing to our newsletter!"
        : "Your message has been sent. We'll get back to you soon!",
  };
}

/**
 * Format price in Nigerian Naira
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get nearby locations based on current state
 */
export function getNearbyLocations(state: string): string[] {
  const cities =
    NIGERIAN_LOCATIONS.cities[state as keyof typeof NIGERIAN_LOCATIONS.cities];
  return cities || NIGERIAN_LOCATIONS.states.slice(0, 10);
}

export default {
  searchAll,
  getProviders,
  getProviderById,
  getServices,
  getServiceById,
  getProducts,
  getProductById,
  bookService,
  addToCart,
  submitContactForm,
  formatNaira,
  getNearbyLocations,
  SERVICE_CATEGORIES,
  NIGERIAN_LOCATIONS,
};
