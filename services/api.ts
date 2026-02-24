// services/api.ts
// Base API configuration for HANDI app

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// ================================
// API Configuration
// ================================
const envApiUrl = process.env.EXPO_PUBLIC_API_URL;
const envUseMock = process.env.EXPO_PUBLIC_USE_MOCK;

const parsedUseMock =
  typeof envUseMock === "string"
    ? envUseMock.trim().toLowerCase() === "true"
    : undefined;

const API_CONFIG = {
  BASE_URL: envApiUrl || "https://api.handiapp.com.ng/v1",
  TIMEOUT: 30000,
  // Default to mock when no backend URL is provided; override with EXPO_PUBLIC_USE_MOCK
  USE_MOCK: parsedUseMock ?? !envApiUrl,
};

// ================================
// API Response Types
// ================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

// ================================
// Token Management
// ================================
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const secureStoreAvailable = SecureStore.isAvailableAsync();

const getStore = async () => {
  try {
    return (await secureStoreAvailable) ? "secure" : "async";
  } catch {
    return "async";
  }
};

export const tokenManager = {
  async getToken(): Promise<string | null> {
    try {
      const store = await getStore();
      if (store === "secure") {
        return await SecureStore.getItemAsync(TOKEN_KEY);
      }
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    const store = await getStore();
    if (store === "secure") {
      await SecureStore.setItemAsync(TOKEN_KEY, token, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
      return;
    }
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      const store = await getStore();
      if (store === "secure") {
        return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      }
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async setRefreshToken(token: string): Promise<void> {
    const store = await getStore();
    if (store === "secure") {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
      return;
    }
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  async clearTokens(): Promise<void> {
    const store = await getStore();
    if (store === "secure") {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      return;
    }
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
  },
};

// ================================
// HTTP Client
// ================================
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

async function makeRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { method = "GET", body, headers = {}, requiresAuth = true } = options;

  // If using mock data, return mock response
  if (API_CONFIG.USE_MOCK) {
    console.log(`[MOCK API] ${method} ${endpoint}`, body);
    return {
      success: true,
      data: undefined,
      message: "Mock response (set EXPO_PUBLIC_API_URL to call backend)",
    };
  }

  try {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    if (requiresAuth) {
      const token = await tokenManager.getToken();
      if (token) {
        requestHeaders["Authorization"] = `Bearer ${token}`;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "An error occurred",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
      statusCode: response.status,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { success: false, error: "Request timeout" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

// ================================
// Exported API Methods
// ================================
export const api = {
  get: <T>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => makeRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(
    endpoint: string,
    body?: Record<string, unknown>,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => makeRequest<T>(endpoint, { ...options, method: "POST", body }),

  put: <T>(
    endpoint: string,
    body?: Record<string, unknown>,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => makeRequest<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T>(
    endpoint: string,
    body?: Record<string, unknown>,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => makeRequest<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => makeRequest<T>(endpoint, { ...options, method: "DELETE" }),
};

export default api;
