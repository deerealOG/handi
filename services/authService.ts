// services/authService.ts
// Authentication service for HANDI app

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResponse, api, tokenManager } from "./api";

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
  tokens?: AuthTokens;
}

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

    const response = await api.post<{
      accessToken: string;
      refreshToken: string;
      user: {
        id: string;
        email: string;
        userType: string;
        fullName: string;
      };
    }>(
      "/api/auth/login",
      { email, password },
      { requiresAuth: false },
    );

    if (!response.success || !response.data) {
      return { success: false, error: response.error || "Login failed" };
    }

    const tokens: AuthTokens = {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresIn: 3600,
    };

    await tokenManager.setToken(tokens.accessToken);
    await tokenManager.setRefreshToken(tokens.refreshToken);

    const [firstName, ...rest] = response.data.user.fullName.split(" ");
    const mappedUser: User = {
      id: response.data.user.id,
      email: response.data.user.email,
      phone: "",
      firstName: firstName || "",
      lastName: rest.join(" "),
      fullName: response.data.user.fullName,
      userType:
        response.data.user.userType?.toLowerCase() === "business"
          ? "business"
          : response.data.user.userType?.toLowerCase() === "artisan"
            ? "artisan"
            : response.data.user.userType?.toLowerCase() === "admin"
              ? "admin"
              : "client",
      isVerified: true,
      isEmailVerified: true,
      isPhoneVerified: false,
      createdAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(USER_KEY, JSON.stringify(mappedUser));

    return {
      success: true,
      data: { user: mappedUser, tokens },
      message: "Login successful",
    };
  },

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const userType =
      data.userType === "business"
        ? "BUSINESS"
        : data.userType === "artisan"
          ? "ARTISAN"
          : data.userType === "admin"
            ? "ADMIN"
            : "CLIENT";

    const response = await api.post<{
      user: {
        id: string;
        email: string;
        userType: string;
        fullName: string;
      };
      otp?: string;
    }>(
      "/api/auth/register",
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        userType,
      },
      { requiresAuth: false },
    );

    if (!response.success || !response.data) {
      return { success: false, error: response.error || "Registration failed" };
    }

    return {
      success: true,
      data: {
        user: {
          id: response.data.user.id,
          email: response.data.user.email,
          phone: data.phone,
          firstName: data.firstName,
          lastName: data.lastName,
          fullName: response.data.user.fullName,
          userType: data.userType,
          isVerified: false,
          isEmailVerified: false,
          isPhoneVerified: false,
          createdAt: new Date().toISOString(),
        },
      },
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
    const response = await api.post<{ message: string }>(
      "/api/auth/forgot-password",
      { email },
      { requiresAuth: false },
    );
    if (!response.success) {
      return { success: false, error: response.error || "Request failed" };
    }
    return {
      success: true,
      data: { message: response.message || "Reset link sent" },
      message: response.message,
    };
  },

  /**
   * Verify OTP code
   */
  async verifyOtp(
    email: string,
    otp: string,
  ): Promise<ApiResponse<{ verified: boolean }>> {
    const response = await api.post<{ verified?: boolean }>(
      "/api/auth/verify-otp",
      { email, otp },
      { requiresAuth: false },
    );
    if (!response.success) {
      return { success: false, error: response.error || "Invalid OTP code" };
    }
    return {
      success: true,
      data: { verified: true },
      message: "OTP verified successfully",
    };
  },

  /**
   * Reset password after OTP verification
   */
  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<ApiResponse<null>> {
    const response = await api.post<null>(
      "/api/auth/reset-password",
      { token, password: newPassword },
      { requiresAuth: false },
    );
    if (!response.success) {
      return {
        success: false,
        error: response.error || "Password reset failed",
      };
    }
    return { success: true, message: "Password reset successful" };
  },

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    const response = await api.patch<User>("/api/profile", updates);
    if (!response.success || !response.data) {
      return { success: false, error: response.error || "Update failed" };
    }
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data));
    return { success: true, data: response.data, message: response.message };
  },

  /**
   * Change password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<ApiResponse<null>> {
    if (newPassword.length < 6) {
      return { success: false, error: "New password must be at least 6 characters" };
    }
    // No backend endpoint yet; keep client-side error.
    return { success: false, error: "Change password is not available yet" };
  },
};

export default authService;
