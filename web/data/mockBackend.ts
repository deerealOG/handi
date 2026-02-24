// data/mockBackend.ts
// Consolidated mock backend with 5000 generated users and comprehensive test data

// ================================
// Seed-based random (deterministic)
// ================================
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

const rand = seededRandom(42);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => rand() - 0.5);
  return shuffled.slice(0, n);
}

function randInt(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function randDate(startYear: number, endYear: number) {
  const y = randInt(startYear, endYear);
  const m = randInt(1, 12);
  const d = randInt(1, 28);
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

// ================================
// Nigerian name data
// ================================
const FIRST_NAMES_M = [
  "Chinedu",
  "Emeka",
  "Obinna",
  "Ifeanyi",
  "Chukwudi",
  "Tunde",
  "Adewale",
  "Babajide",
  "Oluwaseun",
  "Femi",
  "Kelechi",
  "Uchenna",
  "Nnamdi",
  "Ikenna",
  "Chibuzo",
  "Damilare",
  "Olumide",
  "Ayobami",
  "Segun",
  "Kunle",
  "Adebayo",
  "Akin",
  "Bolu",
  "Chidi",
  "Dayo",
  "Ebuka",
  "Fisayo",
  "Gbenga",
  "Idris",
  "Jide",
  "Kehinde",
  "Ladi",
  "Musa",
  "Niyi",
  "Obi",
  "Peter",
  "Qudus",
  "Rotimi",
  "Sola",
  "Taiwo",
  "Uche",
  "Victor",
  "Wale",
  "Yemi",
  "Zubair",
  "Abiodun",
  "Bade",
  "Chigozie",
  "Doyin",
  "Edet",
];

const FIRST_NAMES_F = [
  "Adaobi",
  "Ngozi",
  "Amaka",
  "Chidinma",
  "Nneka",
  "Bukola",
  "Tolulope",
  "Yetunde",
  "Folake",
  "Bisola",
  "Chiamaka",
  "Ifeoma",
  "Nkechi",
  "Adaeze",
  "Chioma",
  "Damilola",
  "Omowumi",
  "Aisha",
  "Sade",
  "Kemi",
  "Abigail",
  "Blessing",
  "Cynthia",
  "Deborah",
  "Esther",
  "Funmi",
  "Grace",
  "Hannah",
  "Ify",
  "Joy",
  "Kate",
  "Linda",
  "Mary",
  "Nike",
  "Oluchi",
  "Precious",
  "Queen",
  "Rose",
  "Sarah",
  "Titi",
  "Uju",
  "Victoria",
  "Wunmi",
  "Yinka",
  "Zainab",
  "Ada",
  "Bimpe",
  "Charity",
  "Diana",
  "Ejiro",
];

const LAST_NAMES = [
  "Okonkwo",
  "Adeyemi",
  "Nwankwo",
  "Ibrahim",
  "Okafor",
  "Adebayo",
  "Eze",
  "Mohammed",
  "Abubakar",
  "Balogun",
  "Udoka",
  "Ogunyemi",
  "Nwosu",
  "Aliyu",
  "Adekunle",
  "Olowe",
  "Igwe",
  "Hassan",
  "Obi",
  "Ojo",
  "Anyanwu",
  "Bakare",
  "Chukwu",
  "Dada",
  "Ekwereme",
  "Fagbemi",
  "Garba",
  "Haruna",
  "Ikechukwu",
  "Jimoh",
  "Kamara",
  "Lawal",
  "Madaki",
  "Nwachukwu",
  "Ogbonna",
  "Peterside",
  "Quadri",
  "Rabiu",
  "Salami",
  "Taiwo",
  "Ukpai",
  "Bello",
  "Adamu",
  "Okoro",
  "Emecheta",
  "Onwuka",
  "Yakubu",
  "Akande",
  "Chikere",
  "Usman",
];

const LAGOS_AREAS = [
  "Lekki",
  "Victoria Island",
  "Ikeja",
  "Surulere",
  "Yaba",
  "Ikoyi",
  "Ajah",
  "Gbagada",
  "Maryland",
  "Magodo",
  "Ogba",
  "Oshodi",
  "Festac",
  "Apapa",
  "Mushin",
  "Agege",
  "Iyana-Ipaja",
  "Alimosho",
  "Epe",
  "Ikorodu",
  "Ojodu",
  "Ogudu",
  "Anthony",
  "Ilupeju",
  "Ketu",
  "Ojota",
  "Somolu",
  "Bariga",
  "Akoka",
  "Oniru",
  "Obalende",
  "Eko Atlantic",
  "Banana Island",
  "Dolphin Estate",
  "1004 Estate",
  "Oregun",
  "Omole",
  "Isheri",
];

const CATEGORIES = [
  "Electrical",
  "Plumbing",
  "Cleaning",
  "Beauty & Spa",
  "Construction",
  "Painting",
  "Pest Control",
  "HVAC",
  "Carpentry",
  "Tech & IT",
  "Catering",
  "Tailoring",
  "Photography",
  "Automotive",
  "Gardening",
  "Moving & Logistics",
  "Security",
  "Tutoring",
];

const SERVICE_NAMES: Record<string, string[]> = {
  Electrical: [
    "Home Wiring",
    "Generator Repair",
    "Solar Panel Installation",
    "Electrical Inspection",
    "Light Fixture Install",
  ],
  Plumbing: [
    "Pipe Repair",
    "Toilet Installation",
    "Water Heater Repair",
    "Drain Cleaning",
    "Leak Detection",
  ],
  Cleaning: [
    "Deep Home Cleaning",
    "Office Cleaning",
    "Post-Construction Cleanup",
    "Carpet Cleaning",
    "Window Washing",
  ],
  "Beauty & Spa": [
    "Bridal Makeup",
    "Hair Styling",
    "Manicure & Pedicure",
    "Facial Treatment",
    "Spa Massage",
  ],
  Construction: [
    "Kitchen Renovation",
    "Bathroom Remodel",
    "Room Addition",
    "Tiling",
    "Plastering",
  ],
  Painting: [
    "Interior Painting",
    "Exterior Painting",
    "Wall Texturing",
    "Wallpaper Installation",
    "POP Ceiling",
  ],
  "Pest Control": [
    "Home Fumigation",
    "Termite Treatment",
    "Rodent Control",
    "Mosquito Treatment",
    "Bed Bug Removal",
  ],
  HVAC: [
    "AC Installation",
    "AC Servicing",
    "AC Repair",
    "Ventilation Setup",
    "Refrigerator Repair",
  ],
  Carpentry: [
    "Furniture Making",
    "Door Installation",
    "Cabinet Work",
    "Roof Repair",
    "Shelf Building",
  ],
  "Tech & IT": [
    "Computer Repair",
    "Network Setup",
    "CCTV Installation",
    "Website Development",
    "Phone Repair",
  ],
  Catering: [
    "Event Catering",
    "Meal Prep Service",
    "Wedding Catering",
    "Corporate Lunch",
    "Birthday Party",
  ],
  Tailoring: [
    "Dress Making",
    "Suit Tailoring",
    "Alterations",
    "Native Wear",
    "Uniform Sewing",
  ],
  Photography: [
    "Event Photography",
    "Portrait Session",
    "Product Shoot",
    "Wedding Coverage",
    "Video Production",
  ],
  Automotive: [
    "Car Servicing",
    "Panel Beating",
    "Auto Electrical",
    "Wheel Alignment",
    "Car Wash",
  ],
  Gardening: [
    "Landscaping",
    "Lawn Mowing",
    "Tree Trimming",
    "Garden Design",
    "Plant Care",
  ],
  "Moving & Logistics": [
    "Home Moving",
    "Office Moving",
    "Interstate Moving",
    "Packing Service",
    "Furniture Assembly",
  ],
  Security: [
    "Guard Service",
    "Alarm Installation",
    "CCTV Monitoring",
    "Access Control",
    "Security Audit",
  ],
  Tutoring: [
    "Math Tutoring",
    "English Lessons",
    "Exam Prep",
    "Music Lessons",
    "Coding Classes",
  ],
};

const PRODUCT_NAMES = [
  "Cordless Drill Set",
  "Pipe Wrench Pro",
  "Cleaning Bucket Kit",
  "Makeup Brush Collection",
  "Safety Helmet",
  "Paint Roller Set",
  "Spray Pump 5L",
  "AC Filter Pack",
  "Wood Polish Kit",
  "Ethernet Cable 50m",
  "Chef Knife Set",
  "Sewing Machine Mini",
  "Camera Tripod",
  "Car Jack Hydraulic",
  "Garden Hose 30m",
  "Moving Boxes Pack",
  "Security Camera 2-Pack",
  "Whiteboard Large",
  "Tool Box Premium",
  "Voltage Tester",
  "Plumber Tape 20-Pack",
  "Disinfectant 5L",
  "Hair Dryer Pro",
  "Cement Mixer Mini",
  "Extension Cord 10m",
  "Pest Spray Industrial",
  "Refrigerant Gas R410",
  "Chisel Set",
  "Laptop Stand",
  "Serving Tray Set",
];

const DISPUTE_CATEGORIES = [
  "Incomplete Work",
  "No Show",
  "Overcharging",
  "Poor Quality",
  "Late Arrival",
  "Property Damage",
  "Rude Behavior",
  "Wrong Service",
  "Refund Dispute",
  "Safety Issue",
];

const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
] as const;
const USER_STATUSES = ["active", "suspended", "banned", "deactivated"] as const;
const PROVIDER_STATUSES = [
  "pending",
  "verified",
  "suspended",
  "rejected",
] as const;
const DISPUTE_STATUSES = [
  "open",
  "investigating",
  "resolved",
  "escalated",
  "closed",
] as const;
const PRIORITIES = ["low", "medium", "high", "urgent"] as const;

// ================================
// Type definitions
// ================================
export type MockUser = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  type: "client" | "provider" | "admin";
  status: (typeof USER_STATUSES)[number];
  joined: string;
  avatar: string | null;
  location: string;
  bookings: number;
  totalSpent: string;
  lastActive: string;
  isVerified: boolean;
};

export type MockProvider = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  status: (typeof PROVIDER_STATUSES)[number];
  rating: number;
  reviews: number;
  jobs: number;
  joined: string;
  avatar: string | null;
  location: string;
  bio: string;
  responseTime: string;
  completedJobs: number;
  revenue: string;
  isOnline: boolean;
  providerType: "Business" | "Specialist" | "Freelancer";
  skills: string[];
  isVerified: boolean;
  verifiedAt: string | null;
  verifiedBy: string | null;
};

export type MockBooking = {
  id: string;
  service: string;
  category: string;
  client: string;
  clientId: string;
  provider: string;
  providerId: string;
  date: string;
  time: string;
  status: (typeof BOOKING_STATUSES)[number];
  amount: string;
  amountNum: number;
  location: string;
  notes: string;
};

export type MockDispute = {
  id: string;
  status: (typeof DISPUTE_STATUSES)[number];
  priority: (typeof PRIORITIES)[number];
  client: string;
  clientId: string;
  provider: string;
  providerId: string;
  service: string;
  amount: string;
  date: string;
  category: string;
  description: string;
  providerResponse: string;
  resolution: string;
};

export type MockTransaction = {
  id: string;
  title: string;
  date: string;
  amount: string;
  amountNum: number;
  type: "credit" | "debit" | "fee" | "refund";
  userId: string;
  userName: string;
  method: string;
  status: "completed" | "pending" | "failed";
};

export type MockService = {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  provider: string;
  providerId: string;
  location: string;
  status: "active" | "paused" | "pending_review";
  bookings: number;
};

export type MockProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  seller: string;
  location: string;
  inStock: boolean;
  image: string;
};

export type MockNotification = {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId: string;
  action?: string;
};

// ================================
// Generators
// ================================
function generatePhone() {
  const prefixes = [
    "0803",
    "0805",
    "0806",
    "0807",
    "0808",
    "0809",
    "0810",
    "0811",
    "0812",
    "0813",
    "0814",
    "0815",
    "0816",
    "0817",
    "0818",
    "0903",
    "0905",
    "0906",
    "0913",
    "0916",
  ];
  return `${pick(prefixes)}${String(randInt(1000000, 9999999))}`;
}

function generateEmail(first: string, last: string) {
  const domains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "mail.com",
    "protonmail.com",
  ];
  const sep = pick([".", "_", ""]);
  return `${first.toLowerCase()}${sep}${last.toLowerCase()}${randInt(1, 999)}@${pick(domains)}`;
}

// ================================
// Generate 5000 Users
// ================================
const ALL_USERS: MockUser[] = [];
const ALL_PROVIDERS: MockProvider[] = [];

// 3500 Clients
for (let i = 0; i < 3500; i++) {
  const isMale = rand() > 0.5;
  const first = isMale ? pick(FIRST_NAMES_M) : pick(FIRST_NAMES_F);
  const last = pick(LAST_NAMES);
  const id = `client_${String(i + 1).padStart(4, "0")}`;
  ALL_USERS.push({
    id,
    firstName: first,
    lastName: last,
    name: `${first} ${last}`,
    email: generateEmail(first, last),
    phone: generatePhone(),
    type: "client",
    status: pick([...USER_STATUSES]),
    joined: randDate(2024, 2026),
    avatar: null,
    location: `${pick(LAGOS_AREAS)}, Lagos`,
    bookings: randInt(0, 50),
    totalSpent: `₦${(randInt(0, 500) * 1000).toLocaleString()}`,
    lastActive: randDate(2025, 2026),
    isVerified: rand() > 0.3,
  });
}

// 1200 Providers
for (let i = 0; i < 1200; i++) {
  const isMale = rand() > 0.4;
  const first = isMale ? pick(FIRST_NAMES_M) : pick(FIRST_NAMES_F);
  const last = pick(LAST_NAMES);
  const id = `provider_${String(i + 1).padStart(4, "0")}`;
  const cat = pick(CATEGORIES);
  const status = pick([...PROVIDER_STATUSES]);
  const jobs = randInt(0, 200);
  const rating = status === "pending" ? 0 : +(3.5 + rand() * 1.5).toFixed(1);
  const prov: MockProvider = {
    id,
    firstName: first,
    lastName: last,
    name: rand() > 0.7 ? `${first}'s ${cat} Services` : `${first} ${last}`,
    email: generateEmail(first, last),
    phone: generatePhone(),
    category: cat,
    status,
    rating,
    reviews: randInt(0, 300),
    jobs,
    joined: randDate(2024, 2026),
    avatar: null,
    location: `${pick(LAGOS_AREAS)}, Lagos`,
    bio: `Professional ${cat.toLowerCase()} provider with ${jobs}+ completed jobs.`,
    responseTime: `~${randInt(5, 120)}m`,
    completedJobs: jobs,
    revenue: `₦${(randInt(10, 5000) * 1000).toLocaleString()}`,
    isOnline: rand() > 0.6,
    providerType: pick(["Business", "Specialist", "Freelancer"]),
    skills: pickN(SERVICE_NAMES[cat] || ["General Service"], randInt(2, 4)),
    isVerified: status === "verified",
    verifiedAt: status === "verified" ? randDate(2024, 2026) : null,
    verifiedBy:
      status === "verified"
        ? `admin_${String(randInt(1, 50)).padStart(4, "0")}`
        : null,
  };
  ALL_PROVIDERS.push(prov);
  ALL_USERS.push({
    id,
    firstName: first,
    lastName: last,
    name: prov.name,
    email: prov.email,
    phone: prov.phone,
    type: "provider",
    status:
      prov.status === "suspended"
        ? "suspended"
        : prov.status === "rejected"
          ? "banned"
          : "active",
    joined: prov.joined,
    avatar: null,
    location: prov.location,
    bookings: jobs,
    totalSpent: prov.revenue,
    lastActive: randDate(2025, 2026),
    isVerified: prov.isVerified,
  });
}

// 300 Admins
for (let i = 0; i < 300; i++) {
  const isMale = rand() > 0.5;
  const first = isMale ? pick(FIRST_NAMES_M) : pick(FIRST_NAMES_F);
  const last = pick(LAST_NAMES);
  const id = `admin_${String(i + 1).padStart(4, "0")}`;
  ALL_USERS.push({
    id,
    firstName: first,
    lastName: last,
    name: `${first} ${last}`,
    email: generateEmail(first, last),
    phone: generatePhone(),
    type: "admin",
    status: "active",
    joined: randDate(2024, 2026),
    avatar: null,
    location: `${pick(LAGOS_AREAS)}, Lagos`,
    bookings: 0,
    totalSpent: "₦0",
    lastActive: randDate(2025, 2026),
    isVerified: true,
  });
}

// ================================
// Generate 500 Bookings
// ================================
const ALL_BOOKINGS: MockBooking[] = [];
for (let i = 0; i < 500; i++) {
  const provider = pick(ALL_PROVIDERS);
  const client = pick(ALL_USERS.filter((u) => u.type === "client"));
  const cat = provider.category;
  const services = SERVICE_NAMES[cat] || ["General Service"];
  const service = pick(services);
  const amt = randInt(5, 200) * 1000;
  ALL_BOOKINGS.push({
    id: `booking_${String(i + 1).padStart(4, "0")}`,
    service,
    category: cat,
    client: client.name,
    clientId: client.id,
    provider: provider.name,
    providerId: provider.id,
    date: randDate(2025, 2026),
    time: `${randInt(7, 18)}:${rand() > 0.5 ? "00" : "30"} ${randInt(7, 11) >= 7 && randInt(7, 18) < 12 ? "AM" : "PM"}`,
    status: pick([...BOOKING_STATUSES]),
    amount: `₦${amt.toLocaleString()}`,
    amountNum: amt,
    location: `${pick(LAGOS_AREAS)}, Lagos`,
    notes: pick([
      "Please come on time",
      "Gate code: 1234",
      "Call when arriving",
      "Park at the back",
      "",
    ]),
  });
}

// ================================
// Generate 50 Disputes
// ================================
const ALL_DISPUTES: MockDispute[] = [];
for (let i = 0; i < 50; i++) {
  const booking = pick(ALL_BOOKINGS);
  const status = pick([...DISPUTE_STATUSES]);
  ALL_DISPUTES.push({
    id: `dispute_${String(i + 1).padStart(4, "0")}`,
    status,
    priority: pick([...PRIORITIES]),
    client: booking.client,
    clientId: booking.clientId,
    provider: booking.provider,
    providerId: booking.providerId,
    service: booking.service,
    amount: booking.amount,
    date: randDate(2025, 2026),
    category: pick(DISPUTE_CATEGORIES),
    description: `Client reported issue with ${booking.service.toLowerCase()} service.`,
    providerResponse:
      status !== "open"
        ? "We are looking into this matter and will resolve it promptly."
        : "",
    resolution:
      status === "resolved" || status === "closed"
        ? "Partial refund issued to client."
        : "",
  });
}

// ================================
// Generate 1000 Transactions
// ================================
const ALL_TRANSACTIONS: MockTransaction[] = [];
const PAYMENT_METHODS = [
  "Card (Visa)",
  "Card (Mastercard)",
  "Bank Transfer",
  "USSD",
  "Wallet",
  "Cash",
];
for (let i = 0; i < 1000; i++) {
  const user = pick(ALL_USERS);
  const type = pick(["credit", "debit", "fee", "refund"] as const);
  const amt = randInt(2, 300) * 1000;
  const status = pick(["completed", "pending", "failed"] as const);
  ALL_TRANSACTIONS.push({
    id: `txn_${String(i + 1).padStart(4, "0")}`,
    title:
      type === "credit"
        ? `Payment — ${pick(CATEGORIES)}`
        : type === "debit"
          ? `Withdrawal to ${pick(["GTBank", "Access Bank", "FirstBank", "UBA", "Zenith"])}`
          : type === "fee"
            ? "Platform Fee"
            : "Refund",
    date: randDate(2025, 2026),
    amount: `${type === "debit" || type === "fee" ? "-" : "+"} ₦${amt.toLocaleString()}`,
    amountNum: type === "debit" || type === "fee" ? -amt : amt,
    type,
    userId: user.id,
    userName: user.name,
    method: pick(PAYMENT_METHODS),
    status,
  });
}

// ================================
// Generate 200 Services
// ================================
const ALL_SERVICES: MockService[] = [];
for (let i = 0; i < 200; i++) {
  const provider = pick(ALL_PROVIDERS);
  const cat = provider.category;
  const services = SERVICE_NAMES[cat] || ["General Service"];
  ALL_SERVICES.push({
    id: `svc_${String(i + 1).padStart(4, "0")}`,
    name: pick(services),
    category: cat,
    price: randInt(5, 200) * 1000,
    rating: +(3.5 + rand() * 1.5).toFixed(1),
    reviews: randInt(0, 200),
    provider: provider.name,
    providerId: provider.id,
    location: provider.location,
    status: pick(["active", "paused", "pending_review"]),
    bookings: randInt(0, 100),
  });
}

// ================================
// Generate 150 Products
// ================================
const ALL_PRODUCTS: MockProduct[] = [];
for (let i = 0; i < 150; i++) {
  const price = randInt(2, 100) * 1000;
  ALL_PRODUCTS.push({
    id: `prod_${String(i + 1).padStart(4, "0")}`,
    name: pick(PRODUCT_NAMES),
    category: pick([
      "tools",
      "electrical",
      "plumbing",
      "cleaning",
      "safety",
      "automotive",
    ]),
    price,
    originalPrice: price + randInt(1, 20) * 1000,
    rating: +(3.5 + rand() * 1.5).toFixed(1),
    reviews: randInt(0, 150),
    seller: `${pick(FIRST_NAMES_M)}'s Store`,
    location: `${pick(LAGOS_AREAS)}, Lagos`,
    inStock: rand() > 0.15,
    image: "/images/products/placeholder.jpg",
  });
}

// ================================
// Generate Notifications
// ================================
const ALL_NOTIFICATIONS: MockNotification[] = [
  {
    id: "n1",
    type: "success",
    title: "Verification Approved",
    message:
      "Your provider account has been verified! You can now receive bookings.",
    timestamp: "2026-02-22T08:00:00",
    read: false,
    userId: "provider_0001",
    action: "view_profile",
  },
  {
    id: "n2",
    type: "info",
    title: "New Booking",
    message: "You have a new booking for Home Cleaning on Feb 25.",
    timestamp: "2026-02-22T09:30:00",
    read: false,
    userId: "provider_0002",
    action: "view_booking",
  },
  {
    id: "n3",
    type: "warning",
    title: "Booking Cancelled",
    message: "Client cancelled the plumbing repair booking.",
    timestamp: "2026-02-22T10:00:00",
    read: false,
    userId: "provider_0003",
  },
  {
    id: "n4",
    type: "success",
    title: "Payment Received",
    message: "₦25,000 has been credited to your wallet.",
    timestamp: "2026-02-22T10:30:00",
    read: true,
    userId: "provider_0004",
  },
  {
    id: "n5",
    type: "error",
    title: "Account Suspended",
    message:
      "Your account has been suspended due to policy violation. Contact support.",
    timestamp: "2026-02-22T11:00:00",
    read: false,
    userId: "provider_0010",
  },
  {
    id: "n6",
    type: "info",
    title: "Welcome to HANDI!",
    message: "Complete your profile to start booking services.",
    timestamp: "2026-02-22T07:00:00",
    read: true,
    userId: "client_0001",
  },
  {
    id: "n7",
    type: "success",
    title: "Booking Confirmed",
    message: "Your AC servicing has been confirmed for Feb 24 at 10 AM.",
    timestamp: "2026-02-22T08:30:00",
    read: false,
    userId: "client_0002",
  },
  {
    id: "n8",
    type: "warning",
    title: "Dispute Opened",
    message: "A dispute has been opened for your recent booking.",
    timestamp: "2026-02-22T09:00:00",
    read: false,
    userId: "client_0005",
  },
];

// ================================
// Auto-message templates
// ================================
export const AUTO_MESSAGES = {
  verification_approved: (name: string) => ({
    title: "✅ Verification Approved",
    message: `Congratulations ${name}! Your provider account has been verified. You can now receive bookings from clients across Lagos.`,
    type: "success" as const,
  }),
  verification_rejected: (name: string, reason: string) => ({
    title: "❌ Verification Rejected",
    message: `Hi ${name}, your verification was not approved. Reason: ${reason}. Please update your documents and resubmit.`,
    type: "error" as const,
  }),
  account_suspended: (name: string, reason: string) => ({
    title: "⚠️ Account Suspended",
    message: `${name}, your account has been suspended. Reason: ${reason}. Contact support for resolution.`,
    type: "warning" as const,
  }),
  account_reinstated: (name: string) => ({
    title: "✅ Account Reinstated",
    message: `Good news ${name}! Your account has been reinstated. You can continue using HANDI.`,
    type: "success" as const,
  }),
  dispute_resolved: (name: string, resolution: string) => ({
    title: "✅ Dispute Resolved",
    message: `Hi ${name}, your dispute has been resolved. ${resolution}`,
    type: "success" as const,
  }),
  booking_completed: (name: string, service: string) => ({
    title: "🎉 Booking Completed",
    message: `Hi ${name}, your ${service} booking has been marked as completed. Please leave a review!`,
    type: "success" as const,
  }),
  new_booking: (provider: string, service: string, date: string) => ({
    title: "📋 New Booking Received",
    message: `Hi ${provider}, you have a new booking for ${service} on ${date}. Accept or decline within 30 minutes.`,
    type: "info" as const,
  }),
  payment_received: (name: string, amount: string) => ({
    title: "💰 Payment Received",
    message: `Hi ${name}, ${amount} has been credited to your HANDI wallet.`,
    type: "success" as const,
  }),
};

// ================================
// Query/filter helpers
// ================================
export function getUsers(opts?: {
  type?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  let result = [...ALL_USERS];
  if (opts?.type && opts.type !== "all")
    result = result.filter((u) => u.type === opts.type);
  if (opts?.status && opts.status !== "all")
    result = result.filter((u) => u.status === opts.status);
  if (opts?.search) {
    const q = opts.search.toLowerCase();
    result = result.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.includes(q),
    );
  }
  const page = opts?.page || 1;
  const limit = opts?.limit || 20;
  return {
    data: result.slice((page - 1) * limit, page * limit),
    total: result.length,
    page,
    totalPages: Math.ceil(result.length / limit),
  };
}

export function getProviders(opts?: {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  let result = [...ALL_PROVIDERS];
  if (opts?.status && opts.status !== "all")
    result = result.filter((p) => p.status === opts.status);
  if (opts?.category && opts.category !== "all")
    result = result.filter((p) => p.category === opts.category);
  if (opts?.search) {
    const q = opts.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }
  const page = opts?.page || 1;
  const limit = opts?.limit || 20;
  return {
    data: result.slice((page - 1) * limit, page * limit),
    total: result.length,
    page,
    totalPages: Math.ceil(result.length / limit),
  };
}

export function getBookings(opts?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  let result = [...ALL_BOOKINGS];
  if (opts?.status && opts.status !== "all")
    result = result.filter((b) => b.status === opts.status);
  if (opts?.search) {
    const q = opts.search.toLowerCase();
    result = result.filter(
      (b) =>
        b.service.toLowerCase().includes(q) ||
        b.client.toLowerCase().includes(q) ||
        b.provider.toLowerCase().includes(q),
    );
  }
  const page = opts?.page || 1;
  const limit = opts?.limit || 20;
  return {
    data: result.slice((page - 1) * limit, page * limit),
    total: result.length,
    page,
    totalPages: Math.ceil(result.length / limit),
  };
}

export function getDisputes(opts?: {
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  let result = [...ALL_DISPUTES];
  if (opts?.status && opts.status !== "all")
    result = result.filter((d) => d.status === opts.status);
  if (opts?.priority && opts.priority !== "all")
    result = result.filter((d) => d.priority === opts.priority);
  if (opts?.search) {
    const q = opts.search.toLowerCase();
    result = result.filter(
      (d) =>
        d.client.toLowerCase().includes(q) ||
        d.provider.toLowerCase().includes(q) ||
        d.service.toLowerCase().includes(q),
    );
  }
  const page = opts?.page || 1;
  const limit = opts?.limit || 20;
  return {
    data: result.slice((page - 1) * limit, page * limit),
    total: result.length,
    page,
    totalPages: Math.ceil(result.length / limit),
  };
}

export function getTransactions(opts?: {
  type?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  let result = [...ALL_TRANSACTIONS];
  if (opts?.type && opts.type !== "all")
    result = result.filter((t) => t.type === opts.type);
  if (opts?.status && opts.status !== "all")
    result = result.filter((t) => t.status === opts.status);
  if (opts?.search) {
    const q = opts.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.userName.toLowerCase().includes(q),
    );
  }
  const page = opts?.page || 1;
  const limit = opts?.limit || 20;
  return {
    data: result.slice((page - 1) * limit, page * limit),
    total: result.length,
    page,
    totalPages: Math.ceil(result.length / limit),
  };
}

export function getServices(opts?: {
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  let result = [...ALL_SERVICES];
  if (opts?.category && opts.category !== "all")
    result = result.filter((s) => s.category === opts.category);
  if (opts?.status && opts.status !== "all")
    result = result.filter((s) => s.status === opts.status);
  const page = opts?.page || 1;
  const limit = opts?.limit || 20;
  return {
    data: result.slice((page - 1) * limit, page * limit),
    total: result.length,
    page,
    totalPages: Math.ceil(result.length / limit),
  };
}

// Single-item lookups
export function getUserById(id: string) {
  return ALL_USERS.find((u) => u.id === id) || null;
}
export function getProviderById(id: string) {
  return ALL_PROVIDERS.find((p) => p.id === id) || null;
}
export function getBookingById(id: string) {
  return ALL_BOOKINGS.find((b) => b.id === id) || null;
}
export function getDisputeById(id: string) {
  return ALL_DISPUTES.find((d) => d.id === id) || null;
}

// Platform stats
export function getPlatformStats() {
  const totalRevenue = ALL_TRANSACTIONS.filter(
    (t) => t.type === "credit" && t.status === "completed",
  ).reduce((sum, t) => sum + t.amountNum, 0);
  const totalFees = ALL_TRANSACTIONS.filter((t) => t.type === "fee").reduce(
    (sum, t) => sum + Math.abs(t.amountNum),
    0,
  );
  return {
    totalUsers: ALL_USERS.length,
    totalClients: ALL_USERS.filter((u) => u.type === "client").length,
    totalProviders: ALL_PROVIDERS.length,
    totalAdmins: ALL_USERS.filter((u) => u.type === "admin").length,
    totalBookings: ALL_BOOKINGS.length,
    completedBookings: ALL_BOOKINGS.filter((b) => b.status === "completed")
      .length,
    pendingBookings: ALL_BOOKINGS.filter((b) => b.status === "pending").length,
    totalDisputes: ALL_DISPUTES.length,
    openDisputes: ALL_DISPUTES.filter((d) => d.status === "open").length,
    totalRevenue: `₦${(totalRevenue / 1000000).toFixed(1)}M`,
    totalFees: `₦${(totalFees / 1000000).toFixed(1)}M`,
    totalTransactions: ALL_TRANSACTIONS.length,
    pendingProviders: ALL_PROVIDERS.filter((p) => p.status === "pending")
      .length,
    verifiedProviders: ALL_PROVIDERS.filter((p) => p.status === "verified")
      .length,
    suspendedProviders: ALL_PROVIDERS.filter((p) => p.status === "suspended")
      .length,
    avgRating: +(
      ALL_PROVIDERS.filter((p) => p.rating > 0).reduce(
        (s, p) => s + p.rating,
        0,
      ) / ALL_PROVIDERS.filter((p) => p.rating > 0).length
    ).toFixed(1),
    totalServices: ALL_SERVICES.length,
    totalProducts: ALL_PRODUCTS.length,
    activeUsers30d: ALL_USERS.filter((u) => u.lastActive >= "2026-01").length,
  };
}

// Financial stats
export function getFinancialStats() {
  const credits = ALL_TRANSACTIONS.filter(
    (t) => t.type === "credit" && t.status === "completed",
  );
  const debits = ALL_TRANSACTIONS.filter(
    (t) => t.type === "debit" && t.status === "completed",
  );
  const fees = ALL_TRANSACTIONS.filter((t) => t.type === "fee");
  const refunds = ALL_TRANSACTIONS.filter((t) => t.type === "refund");
  return {
    totalInflow: credits.reduce((s, t) => s + t.amountNum, 0),
    totalOutflow: debits.reduce((s, t) => s + Math.abs(t.amountNum), 0),
    totalFees: fees.reduce((s, t) => s + Math.abs(t.amountNum), 0),
    totalRefunds: refunds.reduce((s, t) => s + t.amountNum, 0),
    avgTransactionValue: Math.round(
      credits.reduce((s, t) => s + t.amountNum, 0) / (credits.length || 1),
    ),
    byMethod: PAYMENT_METHODS.map((m) => ({
      method: m,
      count: ALL_TRANSACTIONS.filter((t) => t.method === m).length,
      volume: ALL_TRANSACTIONS.filter((t) => t.method === m).reduce(
        (s, t) => s + Math.abs(t.amountNum),
        0,
      ),
    })),
    monthlyTrend: Array.from({ length: 6 }, (_, i) => {
      const month = 12 - 5 + i;
      const y = month > 12 ? 2026 : 2025;
      const m = month > 12 ? month - 12 : month;
      const mStr = `${y}-${String(m).padStart(2, "0")}`;
      const monthTxn = ALL_TRANSACTIONS.filter(
        (t) => t.date.startsWith(mStr) && t.type === "credit",
      );
      return {
        month: mStr,
        revenue: monthTxn.reduce((s, t) => s + t.amountNum, 0),
        count: monthTxn.length,
      };
    }),
  };
}

// User growth stats
export function getUserGrowthStats() {
  const months = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const mStr = `2025-${String(m).padStart(2, "0")}`;
    return {
      month: mStr,
      newClients: ALL_USERS.filter(
        (u) => u.type === "client" && u.joined.startsWith(mStr),
      ).length,
      newProviders: ALL_PROVIDERS.filter((p) => p.joined.startsWith(mStr))
        .length,
    };
  });
  return {
    months,
    byLocation: LAGOS_AREAS.slice(0, 10)
      .map((area) => ({
        area,
        users: ALL_USERS.filter((u) => u.location.includes(area)).length,
      }))
      .sort((a, b) => b.users - a.users),
    byType: {
      clients: ALL_USERS.filter((u) => u.type === "client").length,
      providers: ALL_PROVIDERS.length,
      admins: ALL_USERS.filter((u) => u.type === "admin").length,
    },
    byStatus: {
      active: ALL_USERS.filter((u) => u.status === "active").length,
      suspended: ALL_USERS.filter((u) => u.status === "suspended").length,
      banned: ALL_USERS.filter((u) => u.status === "banned").length,
      deactivated: ALL_USERS.filter((u) => u.status === "deactivated").length,
    },
    topUsers: ALL_USERS.filter((u) => u.type === "client")
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 10),
  };
}

// Export raw arrays for direct access
export {
    ALL_BOOKINGS,
    ALL_DISPUTES, ALL_NOTIFICATIONS, ALL_PRODUCTS, ALL_PROVIDERS, ALL_SERVICES, ALL_TRANSACTIONS, ALL_USERS, CATEGORIES,
    LAGOS_AREAS
};

