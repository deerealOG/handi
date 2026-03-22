// ================================
// Shared Types for HANDI
// ================================

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  provider: string;
  providerId: string;
  location: string;
  image: string;
  description: string;
  duration: string;
  policies: string;
  // Extended fields (item 24)
  offeredBy?: string;
  availability?: string;
  providerVerified?: boolean;
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
  image: string;
  inStock: boolean;
  quantity: number;
  description: string;
  specifications?: Record<string, string>;
  // Extended fields (item 23)
  soldBy?: string;
  policy?: string;
  productImages?: string[];
  similarProducts?: string[];
}

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
  bio: string;
  completedJobs: number;
  skills: string[];
  phone: string;
  providerType?: "Individual" | "Business";
  businessSubType?: "agency" | "company";
  isVerified?: boolean;
  description?: string;
  username?: string;
  email?: string;
  yearRegistered?: number;
  availability?: string;
  pastWorkImages?: string[];
  exactLocation?: string;
  approxDistance?: string;
  categories?: string[];
  specialization?: string;
  policy?: string;
  priceRange?: string;
  servicesOffered?: string[];
  website?: string;
}

export interface Deal {
  id: string;
  serviceId: string;
  serviceName: string;
  provider: string;
  originalPrice: number;
  dealPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  soldSlots: number;
  totalSlots: number;
  endsAt: string;
}

export interface FlashDeal {
  id: string;
  name: string;
  provider: string;
  original: number;
  sale: number;
  discount: number;
  rating: number;
  booked: number;
  image: string;
}

export interface ServiceCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  image: string;
}

export interface Certification {
  id: string;
  name: string;
  type: string;
  year: string;
  issuer: string;
  fileName: string;
  status: "pending" | "verified" | "rejected";
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface NextOfKin {
  name: string;
  relationship: string;
  phone: string;
  address: string;
}

export interface CACCertificate {
  fileName: string;
  uploadedAt: string;
  status: "pending" | "verified" | "rejected";
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified?: boolean;
  phone: string;
  userType: "client" | "provider" | "admin";
  avatar?: string;
  providerSubType?: "individual" | "business";
  bio?: string;
  skills?: string[];
  businessName?: string;
  address?: string;
  preferredCategories?: string[];
  profileComplete?: boolean;
  certifications?: Certification[];
  experience?: WorkExperience[];
  nextOfKin?: NextOfKin;
  cacCertificate?: CACCertificate | null;
  cacGracePeriodEnd?: string | null;
  adminRole?: "super_admin" | "moderator" | "support" | "finance";
}
