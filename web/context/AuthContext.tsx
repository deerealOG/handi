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
  ) => Promise<{ success: boolean; error?: string }>;
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
    phone: "",
    userType: mapUserTypeFromBackend(sessionUser?.userType || "") || "client",
  };
};

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
    phone: profile?.phone || "",
    userType: mappedType,
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
      setBaseUser(null);
      setOverrides({});
      setProfileLoading(false);
      return;
    }

    if (status !== "authenticated") return;

    const fallbackUser = buildUserFromSession(session?.user as any);
    setBaseUser((prev) => prev || fallbackUser);

    const accessToken = (session as any)?.accessToken as string | undefined;
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
          throw new Error(`Profile fetch failed (${res.status})`);
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
  ): Promise<{ success: boolean; error?: string }> => {
    // Try real NextAuth login first
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!result?.error) {
        return { success: true };
      }
    } catch (err) {
      console.warn("NextAuth signIn threw:", err);
    }

    // Dev fallback — only in development when backend is unreachable
    if (process.env.NODE_ENV !== "production") {
      console.warn("⚠️ Backend unreachable — using dev fallback login");

      // Test account email→type mapping
      const TEST_ACCOUNTS: Record<string, "client" | "provider" | "admin"> = {
        "client@handi.ng": "client",
        "provider@handi.ng": "provider",
        "admin@handi.ng": "admin",
        "business@handi.ng": "provider",
      };

      const resolvedType =
        TEST_ACCOUNTS[email.toLowerCase()] || userType || "client";

      const nameMap: Record<string, string> = {
        "client@handi.ng": "Demo Client",
        "provider@handi.ng": "Demo Provider",
        "admin@handi.ng": "Demo Admin",
        "business@handi.ng": "Demo Business",
      };
      const name = nameMap[email.toLowerCase()] || email.split("@")[0];

      const mockUser = buildUserFromSession({
        id: `dev_${resolvedType}_001`,
        name,
        email,
        userType: resolvedType,
      });
      setBaseUser(mockUser);
      return { success: true };
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
    const response = await fetch(`${backendUrl}/api/auth/register`, {
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
    await signOut({ redirect: false });
    setBaseUser(null);
    setOverrides({});
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
