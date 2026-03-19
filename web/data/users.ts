import type { User } from "./types";

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
