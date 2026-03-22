"use client";
// context/AuthContext.tsx
// Web app authentication context backed by NextAuth + backend APIs

import type { User } from "@/data/mockApi";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    userType?: "client" | "provider" | "admin",
  ) => Promise<{ success: boolean; error?: string; requires2FA?: boolean; data?: any }>;
  signup: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    userType: "client" | "provider" | "admin";
    providerSubType?: "individual" | "business";
    bio?: string;
    skills?: string[];
    businessName?: string;
    address?: string;
    preferredCategories?: string[];
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:3001";

type SignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  userType: "client" | "provider" | "admin";
  providerSubType?: "individual" | "business";
  bio?: string;
  skills?: string[];
  businessName?: string;
  address?: string;
  preferredCategories?: string[];
  nin?: string;
  businessRegNumber?: string;
};

const mapUserTypeFromBackend = (userType?: string): User["userType"] | null => {
  if (!userType) return null;
  if (userType === "CLIENT") return "client";
  if (userType === "ADMIN") return "admin";
  if (userType === "ARTISAN" || userType === "BUSINESS") return "provider";
  if (userType === "client" || userType === "provider" || userType === "admin")
    return userType;
  return null;
};

const mapUserTypeToBackend = (
  userType: SignupPayload["userType"],
  providerSubType?: SignupPayload["providerSubType"],
): "CLIENT" | "ARTISAN" | "BUSINESS" | "ADMIN" => {
  if (userType === "client") return "CLIENT";
  if (userType === "admin") return "ADMIN";
  if (providerSubType === "business") return "BUSINESS";
  return "ARTISAN";
};

const buildUserFromSession = (sessionUser?: {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  userType?: string | null;
}): User => {
  const rawName = (sessionUser?.name || "").trim();
  const nameParts = rawName ? rawName.split(" ") : [];
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ");
  return {
    id: sessionUser?.id || "",
    firstName,
    lastName,
    email: sessionUser?.email || "",
    emailVerified: false, // Default to false until profile loads
    phone: "",
    userType: mapUserTypeFromBackend(sessionUser?.userType || "") || "client",
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildUserFromProfile = (profile: any): User => {
  const mappedType = mapUserTypeFromBackend(profile?.userType) || "client";
  const hasProfile =
    mappedType === "client"
      ? Boolean(profile?.address)
      : Boolean(profile?.bio || (profile?.skills && profile.skills.length > 0));
  return {
    id: profile?.id || "",
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    email: profile?.email || "",
    emailVerified: profile?.emailVerified || false,
    phone: profile?.phone || "",
    userType: mappedType,
    providerSubType: profile?.providerSubType || undefined,
    avatar: profile?.avatar || undefined,
    bio: profile?.bio || undefined,
    skills: profile?.skills || undefined,
    address: profile?.address || undefined,
    businessName: profile?.businessName || undefined,
    preferredCategories: profile?.preferredCategories || undefined,
    profileComplete: hasProfile,
  };
};

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [baseUser, setBaseUser] = useState<User | null>(null);
  const [overrides, setOverrides] = useState<Partial<User>>({});
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBaseUser(null);
      setOverrides({});
      setProfileLoading(false);
      return;
    }

    if (status !== "authenticated") return;

    const fallbackUser = buildUserFromSession(session?.user as { id?: string; name?: string; email?: string; userType?: string });
    setBaseUser((prev) => prev || fallbackUser);

    const accessToken = (session as { accessToken?: string })?.accessToken as string | undefined;
    if (!accessToken) {
      return;
    }

    let isMounted = true;
    setProfileLoading(true);
    fetch(`${backendUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) {
            // Token is invalid/expired, sign out to clear the session
            signOut({ redirect: false });
          }
          console.warn(`Profile fetch failed (${res.status})`);
          return;
        }
        const payload = await res.json();
        const profile = payload?.data;
        if (!profile || !isMounted) return;
        const mapped = buildUserFromProfile(profile);
        setBaseUser((prev) => ({
          ...fallbackUser,
          ...prev,
          ...mapped,
        }));
      })
      .catch((error) => {
        console.error("Failed to load profile:", error);
      })
      .finally(() => {
        if (isMounted) setProfileLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [session, status]);

  const user = useMemo(
    () => (baseUser ? { ...baseUser, ...overrides } : null),
    [baseUser, overrides],
  );

  const login = async (
    email: string,
    password: string,
    userType?: "client" | "provider" | "admin",
  ): Promise<{ success: boolean; error?: string; requires2FA?: boolean; data?: any }> => {
    try {
      // First, directly pre-flight login to see if 2FA is needed before hitting NextAuth
      // Also sends loginAs for account type isolation
      const loginBody: Record<string, string> = { email, password };
      if (userType) {
        const loginAsMap: Record<string, string> = {
          client: "CLIENT",
          provider: "PROVIDER",
          admin: "ADMIN",
        };
        loginBody.loginAs = loginAsMap[userType] || userType.toUpperCase();
      }
      const preFlightRes = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginBody),
      });
      const preFlightPayload = await preFlightRes.json();
      
      if (preFlightRes.ok && preFlightPayload.requires2FA) {
        return { 
          success: true, 
          requires2FA: true, 
          data: preFlightPayload.data 
        };
      }

      // If pre-flight failed with account type mismatch (403), return the error
      if (!preFlightRes.ok) {
        return { success: false, error: preFlightPayload.error || "Login failed" };
      }

      // If no 2FA required (or if we are bypassing using otpMode=true), use NextAuth
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result?.error) {
        return { success: true };
      }
    } catch (err) {
      console.warn("Login threw:", err);
    }

    return { success: false, error: "Invalid email or password" };
  };

  const signup = async (
    data: SignupPayload,
  ): Promise<{ success: boolean; error?: string }> => {
    if (data.userType === "admin") {
      return { success: false, error: "Admin signup is not supported" };
    }

    const userType = mapUserTypeToBackend(data.userType, data.providerSubType);

    let response: Response;
    try {
      response = await fetch(`${backendUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          phone: data.phone,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          userType,
          preferredCategories: data.preferredCategories,
          nin: data.nin,
          businessRegNumber: data.businessRegNumber,
        }),
      });
    } catch (err) {
      console.error("Signup network error:", err);
      return {
        success: false,
        error: "Unable to connect to the server. Please check your internet connection and try again.",
      };
    }

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      return {
        success: false,
        error: payload?.error || "Signup failed",
      };
    }

    // Auto-login after successful registration
    const loginResult = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (loginResult?.error) {
      // Registration succeeded but auto-login failed — user can log in manually
      return { success: true };
    }
    return { success: true };
  };

  const logout = async () => {
    setBaseUser(null);
    setOverrides({});
    // Sign out and redirect to home page
    await signOut({ callbackUrl: "/" });
  };

  const updateUser = (updates: Partial<User>) => {
    setOverrides((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: status === "authenticated" || !!baseUser,
        isLoading: status === "loading" || profileLoading,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
