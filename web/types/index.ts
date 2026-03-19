// Types for the HANDI web application

export interface Provider {
  id: string;
  name: string;
  category: string;
  image: string | null;
  location: string;
  rating: number;
  reviews: number;
  price: string;
  isOnline: boolean;
  badge: string | null;
  providerType?: "Individual" | "Business";
  businessSubType?: "agency" | "company";
  isVerified: boolean;
  description: string;
  // Extended fields (items 21, 22)
  username?: string;
  email?: string;
  yearRegistered?: number;
  completedJobs?: number;
  availability?: string;
  pastWorkImages?: string[];
  exactLocation?: string;
  approxDistance?: string;
  categories?: string[];
  specialization?: string;
  policy?: string;
  priceRange?: string;
  servicesOffered?: string[];
  // Business-only fields
  website?: string;
  [key: string]: unknown;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}
