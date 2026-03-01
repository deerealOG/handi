// data/mockApi.ts
// Centralized mock data & lookup functions for HANDI web app

// ================================
// Types
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
  providerType?: "Business" | "Specialist" | "Freelancer";
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
  endsAt: string; // ISO date
}

export interface ServiceCategory {
  id: string;
  label: string;
  icon: string; // Lucide icon name
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

// ================================
// Categories
// ================================
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "electrical",
    label: "Electrical",
    icon: "Zap",
    description: "Wiring, repairs & installations",
    image: "/images/categories/electrical.jpg",
  },
  {
    id: "plumbing",
    label: "Plumbing",
    icon: "Droplets",
    description: "Pipes, leaks & water systems",
    image: "/images/categories/plumbing.jpg",
  },
  {
    id: "beauty",
    label: "Beauty & Wellness",
    icon: "Sparkles",
    description: "Hair, makeup & spa services",
    image: "/images/categories/beauty.jpg",
  },
  {
    id: "cleaning",
    label: "Cleaning",
    icon: "SprayCan",
    description: "Home & office cleaning",
    image: "/images/categories/cleaning.jpg",
  },
  {
    id: "automotive",
    label: "Automotive",
    icon: "Car",
    description: "Car repairs & maintenance",
    image: "/images/categories/automotive.jpg",
  },
  {
    id: "construction",
    label: "Construction",
    icon: "Building2",
    description: "Building & renovation",
    image: "/images/categories/construction.jpg",
  },
  {
    id: "home-improvement",
    label: "Home Improvement",
    icon: "Paintbrush",
    description: "Painting, tiling & décor",
    image: "/images/categories/home.jpg",
  },
  {
    id: "tech",
    label: "Tech & IT",
    icon: "Laptop",
    description: "Computer & phone repairs",
    image: "/images/categories/tech.jpg",
  },
  {
    id: "catering",
    label: "Catering",
    icon: "ChefHat",
    description: "Event catering & meal prep",
    image: "/images/categories/catering.jpg",
  },
  {
    id: "tailoring",
    label: "Tailoring",
    icon: "Scissors",
    description: "Custom clothing & alterations",
    image: "/images/categories/tailoring.jpg",
  },
  {
    id: "photography",
    label: "Photography",
    icon: "Camera",
    description: "Events & portrait photography",
    image: "/images/categories/photography.jpg",
  },
  {
    id: "security",
    label: "Security",
    icon: "Shield",
    description: "Security services & installations",
    image: "/images/categories/security.jpg",
  },
  {
    id: "ac-repair",
    label: "AC Repair",
    icon: "Thermometer",
    description: "AC servicing & installation",
    image: "/images/categories/ac.jpg",
  },
  {
    id: "generator",
    label: "Generator",
    icon: "Fuel",
    description: "Generator repair & servicing",
    image: "/images/categories/generator.jpg",
  },
  {
    id: "fumigation",
    label: "Fumigation",
    icon: "Bug",
    description: "Pest control & fumigation",
    image: "/images/categories/fumigation.jpg",
  },
  {
    id: "gardening",
    label: "Gardening",
    icon: "TreePine",
    description: "Landscaping & garden care",
    image: "/images/categories/gardening.jpg",
  },
];

// ================================
// Product Categories
// ================================
export const PRODUCT_CATEGORIES = [
  { id: "all", label: "All Products" },
  { id: "tools", label: "Tools & Equipment" },
  { id: "electrical", label: "Electrical Supplies" },
  { id: "plumbing", label: "Plumbing Supplies" },
  { id: "beauty", label: "Beauty Products" },
  { id: "cleaning", label: "Cleaning Supplies" },
  { id: "safety", label: "Safety Equipment" },
  { id: "automotive", label: "Automotive Parts" },
];

// ================================
// Mock Services
// ================================
export const MOCK_SERVICES: Service[] = [
  {
    id: "s1",
    name: "Home Electrical Wiring",
    category: "electrical",
    price: 25000,
    originalPrice: 30000,
    rating: 4.8,
    reviews: 89,
    provider: "Chinedu Okonkwo",
    providerId: "p1",
    location: "Ikeja, Lagos",
    image: "/images/services/electrical-wiring.svg",
    description:
      "Complete home electrical wiring including socket installation, distribution board setup, and safety testing. Covers up to 3 bedrooms.",
    duration: "2-3 days",
    policies:
      "All materials must be provided by the customer. No refunds for incomplete work.",
  },
  {
    id: "s2",
    name: "Professional House Cleaning",
    category: "cleaning",
    price: 18000,
    rating: 4.9,
    reviews: 201,
    provider: "Fatima Abdullahi",
    providerId: "p4",
    location: "Wuse, Abuja",
    image: "/images/services/house-cleaning.svg",
    description:
      "Thorough deep cleaning for homes up to 3 bedrooms. Includes kitchen, bathrooms, and all living areas.",
    duration: "4-6 hours",
    policies:
      "All materials must be provided by the customer. No refunds for incomplete work.",
  },
  {
    id: "s3",
    name: "Plumbing Repair & Maintenance",
    category: "plumbing",
    price: 12000,
    rating: 4.7,
    reviews: 145,
    provider: "Emeka Ugochukwu",
    providerId: "p3",
    location: "Lekki, Lagos",
    image: "/images/services/plumbing-repair.svg",
    description:
      "Fix leaking pipes, blocked drains, and toilet issues. Includes parts and labour.",
    duration: "2-4 hours",
    policies:
      "All materials must be provided by the customer. No refunds for incomplete work.",
  },
  {
    id: "s4",
    name: "Bridal Makeup Package",
    category: "beauty",
    price: 45000,
    originalPrice: 60000,
    rating: 4.9,
    reviews: 78,
    provider: "Ngozi Eze",
    providerId: "p5",
    location: "GRA, Port Harcourt",
    image: "/images/services/bridal-makeup.svg",
    description:
      "Complete bridal makeup with trial session and wedding day application. Includes lashes and setting spray.",
    duration: "5-6 hours",
    policies:
      "All materials must be provided by the customer. No refunds for incomplete work.",
  },
  {
    id: "s5",
    name: "AC Installation & Servicing",
    category: "ac-repair",
    price: 15000,
    rating: 4.6,
    reviews: 93,
    provider: "Ibrahim Sule",
    providerId: "p6",
    location: "Garki, Abuja",
    image: "/images/services/ac-service.svg",
    description:
      "Split unit AC installation or full servicing including gas top-up, filter cleaning, and leak check.",
    duration: "3-4 hours",
    policies:
      "All materials must be provided by the customer. No refunds for incomplete work.",
  },
  {
    id: "s6",
    name: "Interior Painting",
    category: "home-improvement",
    price: 35000,
    originalPrice: 42000,
    rating: 4.8,
    reviews: 112,
    provider: "Tunde Bakare",
    providerId: "p7",
    location: "Surulere, Lagos",
    image: "/images/services/painting.svg",
    description:
      "Professional interior painting for up to 3 rooms. Includes primer, 2 coats of emulsion paint, and cleanup.",
    duration: "2-3 days",
    policies:
      "All materials must be provided by the customer. No refunds for incomplete work.",
  },
  {
    id: "s7",
    name: "Car Engine Diagnostics",
    category: "automotive",
    price: 8000,
    rating: 4.5,
    reviews: 67,
    provider: "AutoCare Mechanics",
    providerId: "p8",
    location: "Agege, Lagos",
    image: "/images/services/car-diagnostics.svg",
    description:
      "Complete engine diagnostics using OBD scanner. Includes fault code reading, visual inspection, and written report.",
    duration: "1-2 hours",
    policies:
      "All materials must be provided by the customer. No refunds for incomplete work.",
  },
  {
    id: "s8",
    name: "Full Event Coverage",
    category: "photography",
    price: 80000,
    originalPrice: 100000,
    rating: 4.9,
    reviews: 45,
    provider: "LensArt Studios",
    providerId: "p9",
    location: "VI, Lagos",
    image: "/images/services/event-photography.svg",
    description:
      "Professional photography and videography for your event. Includes edited photos, highlight reel, and full video.",
    duration: "Full day",
    policies:
      "All materials must be provided by the customer. No refunds for incomplete work.",
  },
  {
    id: "s9",
    name: "Generator Servicing",
    category: "generator",
    price: 10000,
    rating: 4.4,
    reviews: 88,
    provider: "PowerFix NG",
    providerId: "p10",
    location: "Wuse 2, Abuja",
    image: "/images/services/generator-service.svg",
    description:
      "Complete generator servicing including oil change, filter replacement, spark plug check, and test run.",
    duration: "2-3 hours",
    policies:
      "All materials must be provided by the customer. No refunds for incomplete work.",
  },
  {
    id: "s10",
    name: "Custom Outfit Tailoring",
    category: "tailoring",
    price: 22000,
    rating: 4.7,
    reviews: 134,
    provider: "StyleCraft Tailors",
    providerId: "p11",
    location: "Aba, Abia",
    image: "/images/services/tailoring.svg",
    description:
      "Custom tailoring for native outfits, agbada, senator styles, or corporate wear. Fabric not included.",
    duration: "5-7 days",
    policies:
      "All materials must be provided by the customer. No refunds for incomplete work.",
  },
  {
    id: "s11",
    name: "Home Fumigation",
    category: "fumigation",
    price: 20000,
    originalPrice: 25000,
    rating: 4.6,
    reviews: 72,
    provider: "SafeHome Pest Control",
    providerId: "p12",
    location: "Ajah, Lagos",
    image: "/images/services/fumigation.svg",
    description:
      "Complete home fumigation for cockroaches, bed bugs, termites, and rodents. Safe for pets after 4 hours.",
    duration: "3-4 hours",
    policies:
      "All materials must be provided by the customer. No refunds for incomplete work.",
  },
  {
    id: "s12",
    name: "Garden Landscaping",
    category: "gardening",
    price: 40000,
    rating: 4.8,
    reviews: 36,
    provider: "GreenThumb NG",
    providerId: "p13",
    location: "Ikoyi, Lagos",
    image: "/images/services/landscaping.svg",
    description:
      "Professional garden landscaping including lawn setup, flower bed design, and irrigation installation.",
    duration: "3-5 days",
    policies:
      "All materials must be provided by the customer. No refunds for incomplete work.",
  },
];

// ================================
// Mock Products
// ================================
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "pr1",
    name: 'QASA Ceiling Fan 56"',
    category: "electrical",
    price: 28000,
    originalPrice: 32000,
    rating: 4.5,
    reviews: 89,
    seller: "TechWorld Lagos",
    location: "Ikeja, Lagos",
    image: "/images/products/ceiling-fan.svg",
    inStock: true,
    quantity: 45,
    description:
      "High-quality 56-inch ceiling fan with 3 speed settings and reversible motor.",
    specifications: {
      "Blade Size": "56 inches",
      "Speed Settings": "3",
      Motor: "Reversible copper",
      Voltage: "220V",
      Color: "Brown/White",
      Warranty: "1 year",
    },
  },
  {
    id: "pr2",
    name: "Professional Drill Set",
    category: "tools",
    price: 45000,
    originalPrice: 55000,
    rating: 4.8,
    reviews: 156,
    seller: "ToolMaster NG",
    location: "Surulere, Lagos",
    image: "/images/products/drill-set.svg",
    inStock: true,
    quantity: 23,
    description:
      "18V cordless drill with 40-piece accessory set. Includes 2 batteries and carry case.",
    specifications: {
      Voltage: "18V",
      Battery: "Li-Ion 2.0Ah x2",
      "Chuck Size": "13mm",
      Accessories: "40 pieces",
      Weight: "1.8 kg",
      Warranty: "2 years",
    },
  },
  {
    id: "pr3",
    name: "Human Hair Brazilian Bundle",
    category: "beauty",
    price: 35000,
    rating: 4.7,
    reviews: 234,
    seller: "BeautyPro NG",
    location: "Yaba, Lagos",
    image: "/images/products/hair-bundle.svg",
    inStock: true,
    quantity: 67,
    description:
      "100% virgin human hair, 3 bundles of 18, 20, 22 inches. Body wave texture.",
    specifications: {
      Material: "100% Virgin Human Hair",
      Lengths: "18, 20, 22 inches",
      Texture: "Body Wave",
      Bundles: "3",
      Color: "Natural Black",
      Lifespan: "12+ months",
    },
  },
  {
    id: "pr4",
    name: "PVC Pipe Fittings Kit",
    category: "plumbing",
    price: 8500,
    rating: 4.3,
    reviews: 42,
    seller: "PlumbParts Lagos",
    location: "Mushin, Lagos",
    image: "/images/products/pipe-fittings.svg",
    inStock: true,
    quantity: 110,
    description:
      "Complete PVC pipe fittings kit with elbows, tees, couplings, and adapters. 1-inch size.",
    specifications: {
      Size: "1 inch",
      Material: "PVC",
      Pieces: "25",
      Types: "Elbow, Tee, Coupling, Adapter",
      Color: "White",
      "Pressure Rating": "10 bar",
    },
  },
  {
    id: "pr5",
    name: "Industrial Cleaning Kit",
    category: "cleaning",
    price: 15000,
    originalPrice: 18000,
    rating: 4.6,
    reviews: 98,
    seller: "CleanPro Supplies",
    location: "Oshodi, Lagos",
    image: "/images/products/cleaning-kit.svg",
    inStock: true,
    quantity: 34,
    description:
      "Professional cleaning kit with mop, bucket, squeegee, microfiber cloths, and cleaning solutions.",
    specifications: {
      "Items Included": "12 pieces",
      "Mop Type": "Spin Mop",
      Bucket: "15L with wringer",
      Cloths: "6 microfiber",
      Solutions: "3 bottles",
      Warranty: "6 months",
    },
  },
  {
    id: "pr6",
    name: "Safety Helmet & Boots Set",
    category: "safety",
    price: 12000,
    rating: 4.4,
    reviews: 67,
    seller: "SafetyGear NG",
    location: "Marina, Lagos",
    image: "/images/products/safety-set.svg",
    inStock: true,
    quantity: 55,
    description:
      "Construction safety helmet with steel-toe boots. EN certified. Available in sizes 40-46.",
    specifications: {
      Certification: "EN 397 / EN 20345",
      "Boot Sizes": "40-46",
      Material: "ABS / Leather",
      Toe: "Steel",
      Color: "Yellow/Black",
      Warranty: "1 year",
    },
  },
  {
    id: "pr7",
    name: "Car Battery 75AH",
    category: "automotive",
    price: 42000,
    originalPrice: 48000,
    rating: 4.5,
    reviews: 83,
    seller: "AutoParts NG",
    location: "Agege, Lagos",
    image: "/images/products/car-battery.svg",
    inStock: true,
    quantity: 19,
    description:
      "Maintenance-free 75AH car battery. 18 months warranty. Suitable for most sedans and SUVs.",
    specifications: {
      Capacity: "75AH",
      Voltage: "12V",
      Type: "Maintenance-free",
      Terminals: "Standard",
      Weight: "18 kg",
      Warranty: "18 months",
    },
  },
  {
    id: "pr8",
    name: "Armoured Electrical Cable 16mm",
    category: "electrical",
    price: 18500,
    rating: 4.6,
    reviews: 51,
    seller: "CableWorld NG",
    location: "Alaba, Lagos",
    image: "/images/products/electrical-cable.svg",
    inStock: true,
    quantity: 200,
    description:
      "16mm armoured electrical cable, sold per metre. Suitable for underground and outdoor installation.",
    specifications: {
      Size: "16mm²",
      Type: "Armoured (SWA)",
      Cores: "3-core + earth",
      Rating: "600/1000V",
      Material: "Copper",
      Standard: "IEC 60502",
    },
  },
];

// ================================
// Mock Providers
// ================================
export const MOCK_PROVIDERS: Provider[] = [
  {
    id: "p1",
    name: "Chinedu Okonkwo",
    category: "Electrical",
    image: null,
    location: "Ikeja, Lagos",
    rating: 4.9,
    reviews: 156,
    price: "₦5,000 - ₦50,000",
    isOnline: true,
    badge: "Top Rated",
    bio: "Master electrician with 12 years experience in residential and commercial wiring.",
    completedJobs: 342,
    skills: ["Wiring", "Panel Boards", "Generator Integration", "Solar"],
    phone: "+234 801 234 5678",
    providerType: "Specialist",
  },
  {
    id: "p2",
    name: "Beauty by Amara",
    category: "Beauty & Wellness",
    image: null,
    location: "Surulere, Lagos",
    rating: 4.7,
    reviews: 89,
    price: "₦3,000 - ₦80,000",
    isOnline: true,
    badge: "Premium",
    bio: "Award-winning makeup artist specializing in bridal and editorial looks.",
    completedJobs: 231,
    skills: ["Bridal Makeup", "Editorial", "Hair Styling", "Training"],
    phone: "+234 802 345 6789",
    providerType: "Freelancer",
  },
  {
    id: "p3",
    name: "Emeka Ugochukwu",
    category: "Plumbing",
    image: null,
    location: "Lekki, Lagos",
    rating: 4.8,
    reviews: 201,
    price: "₦4,000 - ₦80,000",
    isOnline: false,
    badge: "Verified",
    bio: "Certified plumber handling all residential and commercial plumbing needs.",
    completedJobs: 189,
    skills: ["Pipe Fitting", "Drainage", "Water Heater", "Pump Installation"],
    phone: "+234 803 456 7890",
    providerType: "Specialist",
  },
  {
    id: "p4",
    name: "Fatima Abdullahi",
    category: "Cleaning",
    image: null,
    location: "Wuse, Abuja",
    rating: 4.9,
    reviews: 156,
    price: "₦3,500 - ₦35,000",
    isOnline: true,
    badge: "Top Rated",
    bio: "Professional cleaning specialist with a team of trained staff for homes and offices.",
    completedJobs: 415,
    skills: [
      "Deep Cleaning",
      "Office Cleaning",
      "Post-Construction",
      "Laundry",
    ],
    phone: "+234 804 567 8901",
    providerType: "Business",
  },
  {
    id: "p5",
    name: "Ngozi Eze",
    category: "Beauty & Wellness",
    image: null,
    location: "GRA, Port Harcourt",
    rating: 4.9,
    reviews: 78,
    price: "₦10,000 - ₦100,000",
    isOnline: true,
    badge: "Premium",
    bio: "Celebrity makeup artist with experience in weddings and fashion shows.",
    completedJobs: 267,
    skills: ["Bridal Makeup", "Editorial", "Special Effects", "Training"],
    phone: "+234 805 678 9012",
    providerType: "Freelancer",
  },
  {
    id: "p6",
    name: "Ibrahim Sule",
    category: "AC Repair",
    image: null,
    location: "Garki, Abuja",
    rating: 4.6,
    reviews: 93,
    price: "₦5,000 - ₦60,000",
    isOnline: true,
    badge: "Verified",
    bio: "HVAC specialist with expertise in all major AC brands.",
    completedJobs: 178,
    skills: ["Split Unit", "Central AC", "Chiller", "Ventilation"],
    phone: "+234 806 789 0123",
    providerType: "Specialist",
  },
  {
    id: "p7",
    name: "Tunde Bakare",
    category: "Home Improvement",
    image: null,
    location: "Surulere, Lagos",
    rating: 4.8,
    reviews: 112,
    price: "₦15,000 - ₦200,000",
    isOnline: false,
    badge: "Top Rated",
    bio: "Professional painter and decorator with 15 years of experience.",
    completedJobs: 298,
    skills: ["Interior Painting", "Exterior", "Wallpaper", "POP Ceiling"],
    phone: "+234 807 890 1234",
    providerType: "Freelancer",
  },
  {
    id: "p8",
    name: "AutoCare Mechanics",
    category: "Automotive",
    image: null,
    location: "Agege, Lagos",
    rating: 4.5,
    reviews: 124,
    price: "₦8,000 - ₦200,000",
    isOnline: true,
    badge: "Specialist",
    bio: "Full-service auto repair shop with modern diagnostic equipment.",
    completedJobs: 567,
    skills: ["Engine", "Brakes", "AC", "Electrical", "Diagnostics"],
    phone: "+234 808 901 2345",
    providerType: "Business",
  },
  {
    id: "p9",
    name: "LensArt Studios",
    category: "Photography",
    image: null,
    location: "VI, Lagos",
    rating: 4.9,
    reviews: 45,
    price: "₦30,000 - ₦500,000",
    isOnline: true,
    badge: "Premium",
    bio: "Award-winning photography studio for weddings, events, and commercial shoots.",
    completedJobs: 156,
    skills: ["Wedding", "Events", "Product", "Drone", "Video"],
    phone: "+234 809 012 3456",
    providerType: "Business",
  },
  {
    id: "p10",
    name: "PowerFix NG",
    category: "Generator",
    image: null,
    location: "Wuse 2, Abuja",
    rating: 4.4,
    reviews: 88,
    price: "₦5,000 - ₦100,000",
    isOnline: false,
    badge: "Verified",
    bio: "Generator repair and maintenance specialists for all brands and sizes.",
    completedJobs: 234,
    skills: ["Diesel", "Petrol", "Inverter", "Solar Integration"],
    phone: "+234 810 123 4567",
    providerType: "Specialist",
  },
  {
    id: "p11",
    name: "StyleCraft Tailors",
    category: "Tailoring",
    image: null,
    location: "Aba, Abia",
    rating: 4.7,
    reviews: 134,
    price: "₦8,000 - ₦150,000",
    isOnline: true,
    badge: "Top Rated",
    bio: "Master tailors specializing in native and corporate wear with nationwide delivery.",
    completedJobs: 892,
    skills: ["Agbada", "Senator", "Corporate", "Bridal", "Uniforms"],
    phone: "+234 811 234 5678",
    providerType: "Business",
  },
  {
    id: "p12",
    name: "SafeHome Pest Control",
    category: "Fumigation",
    image: null,
    location: "Ajah, Lagos",
    rating: 4.6,
    reviews: 72,
    price: "₦10,000 - ₦80,000",
    isOnline: true,
    badge: "Verified",
    bio: "Licensed pest control company using safe, eco-friendly treatments.",
    completedJobs: 445,
    skills: ["Fumigation", "Termite Control", "Rodent Control", "Bed Bugs"],
    phone: "+234 812 345 6789",
    providerType: "Business",
  },
];

// ================================
// Mock Deals
// ================================
const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 3);

export const MOCK_DEALS: Deal[] = [
  {
    id: "d1",
    serviceId: "s1",
    serviceName: "Home Electrical Wiring",
    provider: "Chinedu Okonkwo",
    originalPrice: 30000,
    dealPrice: 22500,
    discount: 25,
    rating: 4.8,
    reviews: 89,
    image: "/images/services/electrical-wiring.svg",
    soldSlots: 12,
    totalSlots: 20,
    endsAt: futureDate.toISOString(),
  },
  {
    id: "d2",
    serviceId: "s4",
    serviceName: "Bridal Makeup Package",
    provider: "Ngozi Eze",
    originalPrice: 60000,
    dealPrice: 39000,
    discount: 35,
    rating: 4.9,
    reviews: 78,
    image: "/images/services/bridal-makeup.svg",
    soldSlots: 8,
    totalSlots: 15,
    endsAt: futureDate.toISOString(),
  },
  {
    id: "d3",
    serviceId: "s2",
    serviceName: "Professional House Cleaning",
    provider: "Fatima Abdullahi",
    originalPrice: 22000,
    dealPrice: 14300,
    discount: 35,
    rating: 4.9,
    reviews: 201,
    image: "/images/services/house-cleaning.svg",
    soldSlots: 18,
    totalSlots: 25,
    endsAt: futureDate.toISOString(),
  },
  {
    id: "d4",
    serviceId: "s6",
    serviceName: "Interior Painting",
    provider: "Tunde Bakare",
    originalPrice: 42000,
    dealPrice: 29400,
    discount: 30,
    rating: 4.8,
    reviews: 112,
    image: "/images/services/painting.svg",
    soldSlots: 5,
    totalSlots: 10,
    endsAt: futureDate.toISOString(),
  },
  {
    id: "d5",
    serviceId: "s11",
    serviceName: "Home Fumigation",
    provider: "SafeHome Pest Control",
    originalPrice: 25000,
    dealPrice: 17500,
    discount: 30,
    rating: 4.6,
    reviews: 72,
    image: "/images/services/fumigation.svg",
    soldSlots: 15,
    totalSlots: 30,
    endsAt: futureDate.toISOString(),
  },
  {
    id: "d6",
    serviceId: "s8",
    serviceName: "Full Event Coverage",
    provider: "LensArt Studios",
    originalPrice: 100000,
    dealPrice: 70000,
    discount: 30,
    rating: 4.9,
    reviews: 45,
    image: "/images/services/event-photography.svg",
    soldSlots: 3,
    totalSlots: 8,
    endsAt: futureDate.toISOString(),
  },
];

// ================================
// Mock Users (for auth simulation)
// ================================
export const MOCK_USERS: User[] = [
  {
    id: "u1",
    firstName: "Golden",
    lastName: "Amadi",
    email: "golden@example.com",
    phone: "+234 801 234 5678",
    userType: "client",
  },
  {
    id: "u2",
    firstName: "Chinedu",
    lastName: "Okonkwo",
    email: "chinedu@example.com",
    phone: "+234 802 345 6789",
    userType: "provider",
  },
  {
    id: "u3",
    firstName: "Admin",
    lastName: "HANDI",
    email: "admin@handi.ng",
    phone: "08000000000",
    userType: "admin",
  },
];

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
// ================================
// Mock Flash Deals
// ================================
export const MOCK_FLASH_DEALS: FlashDeal[] = [
  {
    id: "d4",
    name: "Emergency Plumbing Repair",
    provider: "FastFix Plumbing",
    original: 15000,
    sale: 10000,
    discount: 33,
    rating: 4.7,
    booked: 45,
    image: "/images/services/plumbing.svg",
  },
  {
    id: "d5",
    name: "Full Spa Treatment",
    provider: "QueenB Beauty Lounge",
    original: 40000,
    sale: 25000,
    discount: 37,
    rating: 4.9,
    booked: 89,
    image: "/images/services/massage.svg",
  },
  {
    id: "d6",
    name: "Generator Tune-up",
    provider: "TechMasters NG",
    original: 25000,
    sale: 18000,
    discount: 28,
    rating: 4.6,
    booked: 67,
    image: "/images/services/generator-service.svg",
  },
  {
    id: "d7",
    name: "Home Fumigation",
    provider: "PestBusters NG",
    original: 30000,
    sale: 20000,
    discount: 33,
    rating: 4.5,
    booked: 112,
    image: "/images/services/fumigation.svg",
  },
  {
    id: "d8",
    name: "Sofa Dry Cleaning",
    provider: "CleanPro Services",
    original: 20000,
    sale: 12000,
    discount: 40,
    rating: 4.8,
    booked: 156,
    image: "/images/services/cleaning.svg",
  },
  {
    id: "d9",
    name: "Brake Pad Replacement",
    provider: "AutoCare Mechanics",
    original: 18000,
    sale: 13000,
    discount: 27,
    rating: 4.4,
    booked: 78,
    image: "/images/services/car-diagnostics.svg",
  },
  {
    id: "d10",
    name: "AC Gas Top-up",
    provider: "CoolBreeze ACs",
    original: 12000,
    sale: 8000,
    discount: 33,
    rating: 4.7,
    booked: 234,
    image: "/images/services/ac-service.svg",
  },
  {
    id: "d11",
    name: "Wall Painting (1 Room)",
    provider: "HomeStyle Interiors",
    original: 35000,
    sale: 25000,
    discount: 28,
    rating: 4.9,
    booked: 45,
    image: "/images/services/painting.svg",
  },
  {
    id: "d12",
    name: "Bridal Makeup",
    provider: "Glow & Go Spa",
    original: 80000,
    sale: 50000,
    discount: 37,
    rating: 4.9,
    booked: 23,
    image: "/images/services/massage.svg",
  },
  {
    id: "d13",
    name: "Personal Chef (Weekend)",
    provider: "Chef Chi Catering",
    original: 100000,
    sale: 75000,
    discount: 25,
    rating: 4.9,
    booked: 34,
    image: "/images/services/tailoring.svg",
  },
  {
    id: "d14",
    name: "Office Server Setup",
    provider: "CodeCraft Studios",
    original: 150000,
    sale: 100000,
    discount: 33,
    rating: 4.8,
    booked: 12,
    image: "/images/services/event-photography.svg",
  },
  {
    id: "d15",
    name: "Security Consult",
    provider: "SafeLife Security",
    original: 20000,
    sale: 10000,
    discount: 50,
    rating: 4.8,
    booked: 56,
    image: "/images/services/security.svg",
  },
  {
    id: "d16",
    name: "Moving Truck (Half Day)",
    provider: "Urban Movers",
    original: 60000,
    sale: 45000,
    discount: 25,
    rating: 4.6,
    booked: 89,
    image: "/images/services/logistics.svg",
  },
  {
    id: "d17",
    name: "TV Wall Mounting",
    provider: "Handy Dan Services",
    original: 15000,
    sale: 10000,
    discount: 33,
    rating: 4.6,
    booked: 167,
    image: "/images/services/tv-mounting.svg",
  },
  {
    id: "d18",
    name: "Generator Service",
    provider: "Adebayo Electricals",
    original: 12000,
    sale: 8000,
    discount: 33,
    rating: 4.8,
    booked: 211,
    image: "/images/services/generator-service.svg",
  },
  {
    id: "d19",
    name: "Carpet Deep Clean",
    provider: "CleanPro Services",
    original: 30000,
    sale: 20000,
    discount: 33,
    rating: 4.7,
    booked: 145,
    image: "/images/services/cleaning.svg",
  },
  {
    id: "d20",
    name: "Ceramic Car Coating",
    provider: "Lagos Car Wash",
    original: 150000,
    sale: 100000,
    discount: 33,
    rating: 4.7,
    booked: 34,
    image: "/images/services/car-service.svg",
  },
  {
    id: "d21",
    name: "1-Month Gym Access",
    provider: "FitLife Personal Training",
    original: 30000,
    sale: 20000,
    discount: 33,
    rating: 4.7,
    booked: 189,
    image: "/images/services/yoga.svg",
  },
  {
    id: "d22",
    name: "Compound Weeding",
    provider: "Flora Gardens",
    original: 15000,
    sale: 10000,
    discount: 33,
    rating: 4.5,
    booked: 76,
    image: "/images/services/landscaping.svg",
  },
  {
    id: "d23",
    name: "Logo Design",
    provider: "Digital Dreams",
    original: 50000,
    sale: 30000,
    discount: 40,
    rating: 4.8,
    booked: 67,
    image: "/images/services/design.svg",
  },
];
