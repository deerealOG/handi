// services/authService.ts
// Authentication service for HANDI app

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResponse, tokenManager } from "./api";

// ================================
// Types
// ================================
export type UserType = "client" | "artisan" | "admin" | "business";

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  userType: UserType;
  isVerified: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  location?: {
    city: string;
    state: string;
    address?: string;
    coordinates?: { lat: number; lng: number };
  };
  createdAt: string;
  // Artisan-specific fields
  skills?: string[];
  rating?: number;
  totalJobs?: number;
  bio?: string;
  certifications?: string[];
  verificationLevel?: "basic" | "verified" | "certified";
}

export interface LoginCredentials {
  email: string;
  password: string;
  userType: UserType;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  userType: UserType;
  referralCode?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ================================
// Mock Data
// ================================
const MOCK_USERS: Record<string, User> = {
  "client@test.com": {
    id: "user_001",
    email: "client@test.com",
    phone: "+234 812 345 6789",
    firstName: "John",
    lastName: "Adebayo",
    fullName: "John Adebayo",
    avatar: undefined,
    userType: "client",
    isVerified: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    location: { city: "Lagos", state: "Lagos" },
    createdAt: "2024-01-15T10:00:00Z",
  },
  "artisan@test.com": {
    id: "artisan_001",
    email: "artisan@test.com",
    phone: "+234 803 456 7890",
    firstName: "Golden",
    lastName: "Amadi",
    fullName: "Golden Amadi",
    avatar: undefined,
    userType: "artisan",
    isVerified: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    location: { city: "Lagos", state: "Lagos" },
    createdAt: "2024-01-10T10:00:00Z",
    skills: ["Electrician", "AC Repair"],
    rating: 4.9,
    totalJobs: 156,
    bio: "Professional electrician with 8 years of experience.",
    certifications: ["NABTEB Certified", "Safety Training"],
    verificationLevel: "certified",
  },
  "admin@test.com": {
    id: "admin_001",
    email: "admin@test.com",
    phone: "+234 800 123 4567",
    firstName: "Admin",
    lastName: "User",
    fullName: "Admin User",
    avatar: undefined,
    userType: "admin",
    isVerified: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    location: { city: "Lagos", state: "Lagos" },
    createdAt: "2024-01-01T10:00:00Z",
  },
};

// Storage keys
const USER_KEY = "current_user";

// ================================
// Auth Service
// ================================
export const authService = {
  /**
   * Login with email and password
   */
  async login(
    credentials: LoginCredentials,
  ): Promise<ApiResponse<AuthResponse>> {
    const { email, password, userType } = credentials;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // For development: Allow any email/password combination
    // Create a dynamic user based on the provided email
    const emailName = email.split("@")[0];
    const firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1);

    const dynamicUser: User = {
      id: `user_${Date.now()}`,
      email: email.toLowerCase(),
      phone: "+234 800 000 0000",
      firstName: firstName,
      lastName: "User",
      fullName: `${firstName} User`,
      avatar: undefined,
      userType: userType,
      isVerified: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      location: { city: "Lagos", state: "Lagos" },
      createdAt: new Date().toISOString(),
      // Artisan-specific fields (only relevant for artisan users)
      ...(userType === "artisan" && {
        skills: ["General Services"],
        rating: 4.5,
        totalJobs: 0,
        bio: "Professional service provider",
        certifications: [],
        verificationLevel: "basic" as const,
      }),
    };

    const tokens: AuthTokens = {
      accessToken: `mock_access_token_${Date.now()}`,
      refreshToken: `mock_refresh_token_${Date.now()}`,
      expiresIn: 3600,
    };

    await tokenManager.setToken(tokens.accessToken);
    await tokenManager.setRefreshToken(tokens.refreshToken);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(dynamicUser));

    return {
      success: true,
      data: { user: dynamicUser, tokens },
      message: "Login successful",
    };
  },

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: data.email,
      phone: data.phone,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`,
      userType: data.userType,
      isVerified: false,
      isEmailVerified: false,
      isPhoneVerified: false,
      createdAt: new Date().toISOString(),
    };

    const tokens: AuthTokens = {
      accessToken: `mock_access_token_${Date.now()}`,
      refreshToken: `mock_refresh_token_${Date.now()}`,
      expiresIn: 3600,
    };

    await tokenManager.setToken(tokens.accessToken);
    await tokenManager.setRefreshToken(tokens.refreshToken);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));

    return {
      success: true,
      data: { user: newUser, tokens },
      message: "Registration successful. Please verify your email.",
    };
  },

  /**
   * Logout current user
   */
  async logout(): Promise<ApiResponse<null>> {
    await tokenManager.clearTokens();
    await AsyncStorage.removeItem(USER_KEY);

    return { success: true, message: "Logged out successfully" };
  },

  /**
   * Get current logged in user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      if (userJson) {
        return JSON.parse(userJson);
      }
    } catch {
      console.error("Error getting current user");
    }
    return null;
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await tokenManager.getToken();
    return !!token;
  },

  /**
   * Request password reset OTP
   */
  async forgotPassword(
    email: string,
  ): Promise<ApiResponse<{ message: string }>> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if email exists
    if (MOCK_USERS[email.toLowerCase()]) {
      return {
        success: true,
        data: { message: "OTP sent to your email" },
        message: "If this email exists, you will receive a reset code.",
      };
    }

    // Always return success to prevent email enumeration
    return {
      success: true,
      message: "If this email exists, you will receive a reset code.",
    };
  },

  /**
   * Verify OTP code
   */
  async verifyOtp(
    email: string,
    otp: string,
  ): Promise<ApiResponse<{ verified: boolean }>> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock: Accept any 6-digit OTP
    if (otp.length === 6 && /^\d+$/.test(otp)) {
      return {
        success: true,
        data: { verified: true },
        message: "OTP verified successfully",
      };
    }

    return {
      success: false,
      error: "Invalid OTP code",
    };
  },

  /**
   * Reset password after OTP verification
   */
  async resetPassword(
    email: string,
    newPassword: string,
  ): Promise<ApiResponse<null>> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (newPassword.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters",
      };
    }

    return {
      success: true,
      message:
        "Password reset successful. Please login with your new password.",
    };
  },

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "Not authenticated" };
    }

    const updatedUser = { ...currentUser, ...updates };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

    return {
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    };
  },

  /**
   * Change password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<ApiResponse<null>> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (currentPassword.length < 6) {
      return { success: false, error: "Current password is incorrect" };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        error: "New password must be at least 6 characters",
      };
    }

    return {
      success: true,
      message: "Password changed successfully",
    };
  },
};

export default authService;
