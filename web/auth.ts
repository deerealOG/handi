// auth.ts
// NextAuth v5 configuration with Credentials, Google, and Facebook providers

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:3001";

export const authConfig = {
  providers: [
    // ── Credentials (email + password) ──────────────────────────────
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials: any) {
        if (credentials?.otpMode === "true") {
          return {
             id: credentials.id as string,
             name: credentials.name as string,
             email: credentials.email as string,
             userType: credentials.userType as string,
             accessToken: credentials.accessToken as string,
          };
        }

        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${backendUrl}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) return null;

          const payload = await res.json();
          if (payload.requires2FA) {
            return {
              id: payload.data.userId,
              name: "",
              email: payload.data.email,
              requires2FA: true,
            };
          }

          const data = payload?.data;
          if (!data?.user) return null;

          return {
            id: data.user.id,
            name: `${data.user.firstName || ""} ${data.user.lastName || ""}`.trim(),
            email: data.user.email,
            userType: data.user.userType,
            accessToken: data.accessToken || data.token,
          };
        } catch {
          return null;
        }
      },
    }),

    // ── Google ───────────────────────────────────────────────────────
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ── Facebook ────────────────────────────────────────────────────
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt" as const,
    maxAge: 2 * 60 * 60, // 2 hours — forces re-login after inactivity
  },

  callbacks: {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, account }: any) {
      // First sign-in — persist extra fields into the JWT
      if (user) {
        token.id = user.id;
        token.userType = user.userType || null;
        token.accessToken = user.accessToken || null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((user as any).requires2FA) {
          token.requires2FA = true;
          return token;
        }
      }

      // For OAuth providers, try to register/link the user in the backend
      if (
        account &&
        (account.provider === "google" || account.provider === "facebook")
      ) {
        try {
          const res = await fetch(`${backendUrl}/api/auth/social-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              email: token.email,
              name: token.name,
              image: token.picture,
              accessToken: account.access_token,
            }),
          });

          if (res.ok) {
            const payload = await res.json();
            if (payload?.data) {
              token.id = payload.data.user?.id || token.id;
              token.userType = payload.data.user?.userType || "client";
              token.accessToken =
                payload.data.accessToken || payload.data.token || null;
            }
          }
        } catch {
          // Backend may not have social-login endpoint yet — continue with defaults
          console.warn(
            `Social login backend call failed for ${account.provider}`,
          );
        }
      }

      return token;
    },

// eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.userType = token.userType as string;
      }
      session.requires2FA = token.requires2FA;
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
