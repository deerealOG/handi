// services/bookingService.ts
// Booking/Job management service for HANDI app

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResponse, PaginatedResponse } from "./api";

// ================================
// Types
// ================================
export type BookingStatus =
  | "pending"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "declined";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "refunded"
  | "failed"
  | "not_required"
  | "free";

export interface Booking {
  id: string;
  clientId: string;
  artisanId: string;

  // Service details
  categoryId: string;
  categoryName: string;
  serviceType: string;
  description: string;

  // Scheduling
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number; // in minutes

  // Location
  address: string;
  city: string;
  coordinates?: { lat: number; lng: number };

  // Pricing
  estimatedPrice: number;
  finalPrice?: number;
  currency: string;

  // Status
  status: BookingStatus;
  paymentStatus?: PaymentStatus;

  // Attachments
  images?: string[];
  documents?: string[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
  completedAt?: string;

  // Related data (populated)
  client?: {
    id: string;
    fullName: string;
    phone: string;
    avatar?: string;
  };
  artisan?: {
    id: string;
    fullName: string;
    phone: string;
    avatar?: string;
    rating: number;
    skills: string[];
  };

  // Review (if completed)
  review?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
}

export interface CreateBookingData {
  artisanId: string;
  categoryId: string;
  categoryName: string;
  serviceType: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  city: string;
  estimatedPrice: number;
  images?: string[];
}

export interface BookingFilters {
  status?: BookingStatus | "all";
  startDate?: string;
  endDate?: string;
  page?: number;
  perPage?: number;
}

// ================================
// Mock Data
// ================================
const STORAGE_KEY = "bookings";

const MOCK_BOOKINGS: Booking[] = [
  {
    id: "booking_001",
    clientId: "user_001",
    artisanId: "artisan_001",
    categoryId: "electrician",
    categoryName: "Electrician",
    serviceType: "Wiring Installation",
    description: "Need new wiring for 2 rooms",
    scheduledDate: "2024-12-15",
    scheduledTime: "10:00 AM",
    estimatedDuration: 180,
    address: "15 Victoria Island",
    city: "Lagos",
    estimatedPrice: 25000,
    currency: "NGN",
    status: "pending",
    paymentStatus: "not_required",
    createdAt: "2024-12-10T08:00:00Z",
    updatedAt: "2024-12-10T08:00:00Z",
    client: {
      id: "user_001",
      fullName: "John Adebayo",
      phone: "+234 812 345 6789",
    },
    artisan: {
      id: "artisan_001",
      fullName: "Golden Amadi",
      phone: "+234 803 456 7890",
      rating: 4.9,
      skills: ["Electrician", "AC Repair"],
    },
  },
  {
    id: "booking_002",
    clientId: "user_001",
    artisanId: "artisan_002",
    categoryId: "plumber",
    categoryName: "Plumber",
    serviceType: "Pipe Repair",
    description: "Leaking pipe under kitchen sink",
    scheduledDate: "2024-12-12",
    scheduledTime: "2:00 PM",
    estimatedDuration: 60,
    address: "25 Lekki Phase 1",
    city: "Lagos",
    estimatedPrice: 15000,
    finalPrice: 15000,
    currency: "NGN",
    status: "completed",
    paymentStatus: "not_required",
    createdAt: "2024-12-05T10:00:00Z",
    updatedAt: "2024-12-12T16:00:00Z",
    completedAt: "2024-12-12T15:30:00Z",
    client: {
      id: "user_001",
      fullName: "John Adebayo",
      phone: "+234 812 345 6789",
    },
    artisan: {
      id: "artisan_002",
      fullName: "Chidi Okonkwo",
      phone: "+234 805 678 9012",
      rating: 4.7,
      skills: ["Plumber", "Pipe Fitting"],
    },
    review: {
      rating: 5,
      comment: "Excellent service! Fixed the issue quickly.",
      createdAt: "2024-12-12T17:00:00Z",
    },
  },
];

// ================================
// Helper Functions
// ================================
async function getStoredBookings(): Promise<Booking[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error reading bookings:", e);
  }
  // Initialize with mock data
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_BOOKINGS));
  return MOCK_BOOKINGS;
}

async function saveBookings(bookings: Booking[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

// ================================
// Booking Service
// ================================
export const bookingService = {
  /**
   * Create a new booking
   */
  async createBooking(data: CreateBookingData): Promise<ApiResponse<Booking>> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const bookings = await getStoredBookings();
    const now = new Date().toISOString();

    const newBooking: Booking = {
      id: `booking_${Date.now()}`,
      clientId: "user_001", // Would come from auth context
      artisanId: data.artisanId,
      categoryId: data.categoryId,
      categoryName: data.categoryName,
      serviceType: data.serviceType,
      description: data.description,
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime,
      estimatedDuration: 120,
      address: data.address,
      city: data.city,
      estimatedPrice: 0, // Set to 0 for free service
      finalPrice: 0, // Set to 0 for free service
      currency: "NGN",
      status: "pending",
      paymentStatus: "not_required", // Mark as not required for free service
      images: data.images,
      createdAt: now,
      updatedAt: now,
    };

    bookings.unshift(newBooking);
    await saveBookings(bookings);

    return {
      success: true,
      data: newBooking,
      message: "Booking created successfully",
    };
  },

  /**
   * Get bookings for current user (client or artisan)
   */
  async getBookings(
    userId: string,
    userType: "client" | "artisan",
    filters?: BookingFilters,
  ): Promise<PaginatedResponse<Booking>> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let bookings = await getStoredBookings();

    // Filter by user
    bookings = bookings.filter((b) =>
      userType === "client" ? b.clientId === userId : b.artisanId === userId,
    );

    // Apply status filter
    if (filters?.status && filters.status !== "all") {
      bookings = bookings.filter((b) => b.status === filters.status);
    }

    // Apply date filters
    if (filters?.startDate) {
      bookings = bookings.filter((b) => b.scheduledDate >= filters.startDate!);
    }
    if (filters?.endDate) {
      bookings = bookings.filter((b) => b.scheduledDate <= filters.endDate!);
    }

    // Pagination
    const page = filters?.page || 1;
    const perPage = filters?.perPage || 10;
    const start = (page - 1) * perPage;
    const paginatedBookings = bookings.slice(start, start + perPage);

    return {
      success: true,
      data: paginatedBookings,
      pagination: {
        page,
        perPage,
        total: bookings.length,
        totalPages: Math.ceil(bookings.length / perPage),
      },
    };
  },

  /**
   * Get a single booking by ID
   */
  async getBookingById(bookingId: string): Promise<ApiResponse<Booking>> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const bookings = await getStoredBookings();
    const booking = bookings.find((b) => b.id === bookingId);

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    return { success: true, data: booking };
  },

  /**
   * Update booking status (for artisan to accept/decline)
   */
  async updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
  ): Promise<ApiResponse<Booking>> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const bookings = await getStoredBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);

    if (index === -1) {
      return { success: false, error: "Booking not found" };
    }

    bookings[index] = {
      ...bookings[index],
      status,
      updatedAt: new Date().toISOString(),
      ...(status === "completed"
        ? { completedAt: new Date().toISOString() }
        : {}),
    };

    await saveBookings(bookings);

    return {
      success: true,
      data: bookings[index],
      message: `Booking ${status}`,
    };
  },

  /**
   * Cancel a booking (client only)
   */
  async cancelBooking(
    bookingId: string,
    reason?: string,
  ): Promise<ApiResponse<Booking>> {
    return this.updateBookingStatus(bookingId, "cancelled");
  },

  /**
   * Add a review to a completed booking
   */
  async addReview(
    bookingId: string,
    rating: number,
    comment: string,
  ): Promise<ApiResponse<Booking>> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const bookings = await getStoredBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);

    if (index === -1) {
      return { success: false, error: "Booking not found" };
    }

    if (bookings[index].status !== "completed") {
      return { success: false, error: "Can only review completed bookings" };
    }

    bookings[index].review = {
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    await saveBookings(bookings);

    return {
      success: true,
      data: bookings[index],
      message: "Review submitted successfully",
    };
  },

  /**
   * Get booking statistics
   */
  async getBookingStats(
    userId: string,
    userType: "client" | "artisan",
  ): Promise<
    ApiResponse<{
      total: number;
      pending: number;
      completed: number;
      cancelled: number;
      totalSpent?: number;
      totalEarned?: number;
    }>
  > {
    const bookings = await getStoredBookings();
    const userBookings = bookings.filter((b) =>
      userType === "client" ? b.clientId === userId : b.artisanId === userId,
    );

    const stats = {
      total: userBookings.length,
      pending: userBookings.filter(
        (b) => b.status === "pending" || b.status === "accepted",
      ).length,
      completed: userBookings.filter((b) => b.status === "completed").length,
      cancelled: userBookings.filter((b) => b.status === "cancelled").length,
    };

    if (userType === "client") {
      return {
        success: true,
        data: {
          ...stats,
          totalSpent: userBookings
            .filter((b) => b.status === "completed")
            .reduce((sum, b) => sum + (b.finalPrice || b.estimatedPrice), 0),
        },
      };
    } else {
      return {
        success: true,
        data: {
          ...stats,
          totalEarned: userBookings
            .filter((b) => b.status === "completed")
            .reduce(
              (sum, b) => sum + (b.finalPrice || b.estimatedPrice) * 0.85,
              0,
            ), // 85% goes to artisan
        },
      };
    }
  },
};

export default bookingService;
