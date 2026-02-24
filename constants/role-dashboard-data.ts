export type ProviderBookingStatus =
  | "pending"
  | "upcoming"
  | "completed"
  | "cancelled"
  | "confirmed"
  | "in_progress"
  | "disputed";

export const PROVIDER_DASHBOARD_STATS = [
  { key: "total_jobs", label: "Total Jobs", value: "45" },
  { key: "rating", label: "Rating", value: "4.8" },
  { key: "month", label: "This Month", value: "NGN 125,000" },
  { key: "pending", label: "Pending", value: "2" },
];

export const PROVIDER_SERVICES = [
  {
    id: "ps1",
    name: "Home Fumigation",
    category: "Pest Control",
    price: "NGN 20,000",
    status: "active",
    bookings: 12,
    rating: 4.8,
  },
  {
    id: "ps2",
    name: "Deep Cleaning",
    category: "Cleaning",
    price: "NGN 15,000",
    status: "active",
    bookings: 28,
    rating: 4.9,
  },
  {
    id: "ps3",
    name: "Kitchen Renovation",
    category: "Construction",
    price: "NGN 120,000",
    status: "paused",
    bookings: 5,
    rating: 4.7,
  },
];

export const PROVIDER_BOOKINGS: Array<{
  id: string;
  service: string;
  client: string;
  date: string;
  time: string;
  status: ProviderBookingStatus;
  amount: string;
}> = [
  {
    id: "pb1",
    service: "Home Fumigation",
    client: "Adaobi Chen",
    date: "2026-02-26",
    time: "10:00 AM",
    status: "pending",
    amount: "NGN 20,000",
  },
  {
    id: "pb2",
    service: "Deep Cleaning",
    client: "Emeka Johnson",
    date: "2026-02-22",
    time: "2:00 PM",
    status: "upcoming",
    amount: "NGN 15,000",
  },
  {
    id: "pb3",
    service: "Kitchen Renovation",
    client: "Sarah Williams",
    date: "2026-02-15",
    time: "9:00 AM",
    status: "completed",
    amount: "NGN 45,000",
  },
  {
    id: "pb4",
    service: "Deep Cleaning",
    client: "Tunde Bakare",
    date: "2026-02-28",
    time: "11:00 AM",
    status: "pending",
    amount: "NGN 15,000",
  },
  {
    id: "pb5",
    service: "Home Fumigation",
    client: "Grace Obi",
    date: "2026-02-10",
    time: "3:00 PM",
    status: "completed",
    amount: "NGN 20,000",
  },
  {
    id: "pb6",
    service: "Kitchen Renovation",
    client: "James Nwachukwu",
    date: "2026-01-30",
    time: "8:00 AM",
    status: "cancelled",
    amount: "NGN 120,000",
  },
];

export const PROVIDER_TRANSACTIONS = [
  {
    id: "pt1",
    title: "Payment | Deep Cleaning",
    date: "Today, 2:30 PM",
    amount: "+ NGN 15,000",
    type: "credit" as const,
  },
  {
    id: "pt2",
    title: "Withdrawal to GTBank",
    date: "Feb 19, 2026",
    amount: "- NGN 50,000",
    type: "debit" as const,
  },
  {
    id: "pt3",
    title: "Payment | Fumigation",
    date: "Feb 18, 2026",
    amount: "+ NGN 20,000",
    type: "credit" as const,
  },
  {
    id: "pt4",
    title: "Commission Fee",
    date: "Feb 18, 2026",
    amount: "- NGN 2,000",
    type: "debit" as const,
  },
];

export const ADMIN_PLATFORM_STATS = {
  totalUsers: 12450,
  totalProviders: 890,
  totalBookings: 34200,
  revenue: "NGN 24.5M",
  activeDisputes: 8,
  pendingProviders: 15,
};

export const ADMIN_USERS = [
  {
    id: "u1",
    name: "Golden Amadi",
    email: "golden@example.com",
    type: "client",
    status: "active",
    joined: "Jan 15, 2026",
    location: "Lekki, Lagos",
  },
  {
    id: "u2",
    name: "Adaobi Chen",
    email: "adaobi@example.com",
    type: "client",
    status: "active",
    joined: "Feb 1, 2026",
    location: "Victoria Island, Lagos",
  },
  {
    id: "u3",
    name: "Emeka Johnson",
    email: "emeka@example.com",
    type: "client",
    status: "suspended",
    joined: "Dec 20, 2025",
    location: "Ikeja, Lagos",
  },
  {
    id: "u4",
    name: "Tunde Bakare",
    email: "tunde@example.com",
    type: "provider",
    status: "active",
    joined: "Jan 28, 2026",
    location: "Surulere, Lagos",
  },
  {
    id: "u5",
    name: "Grace Obi",
    email: "grace@example.com",
    type: "client",
    status: "active",
    joined: "Feb 10, 2026",
    location: "Yaba, Lagos",
  },
];

export const ADMIN_DISPUTES = [
  {
    id: "d1",
    status: "open",
    priority: "high",
    client: "Golden Amadi",
    provider: "Handi Plumbing",
    service: "Plumbing Repair",
    amount: "NGN 12,000",
    date: "Feb 20, 2026",
    category: "Incomplete Work",
  },
  {
    id: "d2",
    status: "in-review",
    priority: "medium",
    client: "Adaobi Chen",
    provider: "CleanPro Services",
    service: "Deep Cleaning",
    amount: "NGN 15,000",
    date: "Feb 18, 2026",
    category: "Quality Issue",
  },
  {
    id: "d3",
    status: "resolved",
    priority: "low",
    client: "Tunde Bakare",
    provider: "Chinedu Okonkwo",
    service: "Electrical Wiring",
    amount: "NGN 25,000",
    date: "Feb 12, 2026",
    category: "Billing Dispute",
  },
];

export const ADMIN_BOOKINGS = [
  {
    id: "ab1",
    service: "Deep Cleaning",
    client: "Golden Amadi",
    provider: "CleanPro Services",
    date: "Feb 22, 2026",
    time: "10:00 AM",
    status: "confirmed",
    amount: "NGN 15,000",
  },
  {
    id: "ab2",
    service: "Plumbing Repair",
    client: "Adaobi Chen",
    provider: "Handi Plumbing",
    date: "Feb 21, 2026",
    time: "2:00 PM",
    status: "pending",
    amount: "NGN 12,000",
  },
  {
    id: "ab3",
    service: "Electrical Wiring",
    client: "James Nwachukwu",
    provider: "Chinedu Okonkwo",
    date: "Feb 20, 2026",
    time: "9:00 AM",
    status: "completed",
    amount: "NGN 25,000",
  },
  {
    id: "ab4",
    service: "Bridal Makeup",
    client: "Aisha Mohammed",
    provider: "Sarah Beauty Hub",
    date: "Feb 16, 2026",
    time: "6:00 AM",
    status: "disputed",
    amount: "NGN 35,000",
  },
];

export const ADMIN_SERVICE_CATEGORIES = [
  {
    id: "c1",
    name: "Home Cleaning",
    services: 45,
    providers: 23,
    avgPrice: "NGN 12,000",
    status: "active",
  },
  {
    id: "c2",
    name: "Plumbing",
    services: 32,
    providers: 18,
    avgPrice: "NGN 15,000",
    status: "active",
  },
  {
    id: "c3",
    name: "Electrical",
    services: 28,
    providers: 15,
    avgPrice: "NGN 18,000",
    status: "active",
  },
  {
    id: "c4",
    name: "Tech Support",
    services: 22,
    providers: 14,
    avgPrice: "NGN 10,000",
    status: "draft",
  },
];

export const ADMIN_ACTIVITY = [
  "New provider application: AutoCare Mechanics",
  "Dispute #D1 opened by Golden Amadi",
  "New user registered: Fatima Bello",
  "Dispute #D3 resolved | partial refund issued",
];

export const ADMIN_DECISION_LOG = [
  "Approved provider | CleanPro Services",
  "Resolved dispute | #DSP-1089",
  "Issued refund | NGN 40,000 to Fatima Bello",
  "Suspended user | bad_actor_99",
];
