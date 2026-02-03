// context/AuthContext.tsx
// Global authentication context for HANDI app

import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
    authService,
    LoginCredentials,
    RegisterData,
    User,
    UserType,
} from "../services";

// ================================
// Types
// ================================
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: UserType | null;
  isGuest: boolean;
}

interface AuthContextType extends AuthState {
  login: (
    credentials: LoginCredentials,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    data: RegisterData,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  forgotPassword: (
    email: string,
  ) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (
    email: string,
    otp: string,
  ) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (
    email: string,
    newPassword: string,
  ) => Promise<{ success: boolean; error?: string }>;
  setGuestMode: (enabled: boolean) => void;
}

// ================================
// Context
// ================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ================================
// Provider
// ================================
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    userType: null,
    isGuest: false,
  });

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Protect routes based on auth status
  useEffect(() => {
    if (state.isLoading) return;

    const inAuthGroup = segments[0] === "auth";
    const inClientGroup = segments[0] === "client";
    const inArtisanGroup = segments[0] === "artisan";
    const inBusinessGroup = segments[0] === "business";
    const inAdminGroup = segments[0] === "admin";

    if (!state.isAuthenticated && !state.isGuest) {
      // Not authenticated and not guest - redirect to welcome if trying to access protected routes
      if (inClientGroup || inArtisanGroup || inAdminGroup || inBusinessGroup) {
        router.replace("/welcome");
      }
    } else if (
      state.isGuest &&
      (inArtisanGroup || inAdminGroup || inBusinessGroup)
    ) {
      // Guest can only browse client section
      router.replace("/client");
    } else {
      // Authenticated - redirect based on user type if on auth screens
      if (inAuthGroup || segments[0] === "welcome") {
        switch (state.userType) {
          case "client":
            router.replace("/client");
            break;
          case "artisan":
            router.replace("/artisan");
            break;
          case "admin":
            router.replace("/admin");
            break;
          case "business":
            router.replace("/business");
            break;
          default:
            router.replace("/welcome");
        }
      }
    }
  }, [state.isAuthenticated, state.isLoading, state.userType, segments]);

  const checkAuthStatus = async () => {
    try {
      const user = await authService.getCurrentUser();
      const isAuth = await authService.isAuthenticated();

      setState({
        user,
        isLoading: false,
        isAuthenticated: isAuth && !!user,
        userType: user?.userType || null,
        isGuest: false,
      });
    } catch (error) {
      console.error("Error checking auth status:", error);
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        userType: null,
        isGuest: false,
      });
    }
  };

  const login = async (
    credentials: LoginCredentials,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authService.login(credentials);

      if (response.success && response.data) {
        setState({
          user: response.data.user,
          isLoading: false,
          isAuthenticated: true,
          userType: response.data.user.userType,
          isGuest: false,
        });
        return { success: true };
      }

      return { success: false, error: response.error || "Login failed" };
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const register = async (
    data: RegisterData,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authService.register(data);

      if (response.success && response.data) {
        setState({
          user: response.data.user,
          isLoading: false,
          isAuthenticated: true,
          userType: response.data.user.userType,
          isGuest: false,
        });
        return { success: true };
      }

      return { success: false, error: response.error || "Registration failed" };
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        userType: null,
        isGuest: false,
      });
      router.replace("/welcome");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    try {
      const response = await authService.updateProfile(updates);
      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          user: response.data!,
        }));
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const forgotPassword = async (
    email: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authService.forgotPassword(email);
      return { success: response.success, error: response.error };
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const verifyOtp = async (
    email: string,
    otp: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authService.verifyOtp(email, otp);
      return { success: response.success, error: response.error };
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const resetPassword = async (
    email: string,
    newPassword: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authService.resetPassword(email, newPassword);
      return { success: response.success, error: response.error };
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const setGuestMode = (enabled: boolean) => {
    setState((prev) => ({ ...prev, isGuest: enabled }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
        forgotPassword,
        verifyOtp,
        resetPassword,
        setGuestMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ================================
// Hook
// ================================
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
