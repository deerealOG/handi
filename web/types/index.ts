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
  providerType?: "Business" | "Specialist" | "Freelancer";
  [key: string]: unknown;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}
