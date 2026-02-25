import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";

const backendUrl =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:3001";

const decodeJwtPayload = (token: string): { exp?: number } => {
  const payload = token.split(".")[1];
  if (!payload) return {};
  const decoded = Buffer.from(payload, "base64url").toString("utf8");
  return JSON.parse(decoded);
};

const getAccessTokenExpires = (token: string): number => {
  try {
    const payload = decodeJwtPayload(token);
    if (payload.exp) {
      return payload.exp * 1000;
    }
  } catch (error) {
    console.error("Failed to decode access token:", error);
  }
  return Date.now() + 15 * 60 * 1000;
};

const providers = [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email;
      const password = credentials?.password;
      if (!email || !password) return null;

      try {
        const response = await fetch(`${backendUrl}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) return null;
        const data = await response.json();

        return {
          id: data?.data?.user?.id,
          email: data?.data?.user?.email,
          name: data?.data?.user?.fullName,
          userType: data?.data?.user?.userType,
          accessToken: data?.data?.accessToken,
          refreshToken: data?.data?.refreshToken,
        };
      } catch {
        // Backend unreachable — return null so the client-side
        // dev fallback in AuthContext can handle mock login
        console.warn("[NextAuth] Backend unreachable for credentials login");
        return null;
      }
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  );
}

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  providers,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider && account.provider !== "credentials") {
        try {
          const response = await fetch(`${backendUrl}/api/auth/oauth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user?.email,
              provider: account.provider,
              name: user?.name,
            }),
          });

          if (!response.ok) {
            const payload = await response.json().catch(() => null);
            if (
              response.status === 403 &&
              payload?.error === "Email not verified"
            ) {
              token.error = "EmailNotVerified";
              token.email = user?.email;
              token.verificationRequired = true;
              return token;
            }
            token.error = "OAuthAccountNotLinked";
            return token;
          }

          const data = await response.json();
          const accessToken = data?.data?.accessToken as string | undefined;
          const refreshToken = data?.data?.refreshToken as string | undefined;

          token.accessToken = accessToken;
          token.refreshToken = refreshToken;
          token.userType = data?.data?.user?.userType;
          token.name = data?.data?.user?.fullName;
          token.email = data?.data?.user?.email;
          token.sub = data?.data?.user?.id;
          if (accessToken) {
            token.accessTokenExpires = getAccessTokenExpires(accessToken);
          }
          return token;
        } catch (error) {
          console.error("OAuth backend exchange failed:", error);
          token.error = "OAuthAccountNotLinked";
          return token;
        }
      }

      if (user) {
        const accessToken = (user as any).accessToken as string | undefined;
        const refreshToken = (user as any).refreshToken as string | undefined;
        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
        token.userType = (user as any).userType;
        token.name = user.name;
        token.email = user.email;
        token.sub = user.id;
        if (accessToken) {
          token.accessTokenExpires = getAccessTokenExpires(accessToken);
        }
      }

      const expiresAt = token.accessTokenExpires as number | undefined;
      if (expiresAt && Date.now() < expiresAt - 30_000) {
        return token;
      }

      if (!token.refreshToken) {
        token.error = "NoRefreshToken";
        return token;
      }

      try {
        const response = await fetch(`${backendUrl}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: token.refreshToken }),
        });

        if (!response.ok) {
          token.error = "RefreshAccessTokenError";
          return token;
        }

        const data = await response.json();
        const accessToken = data?.data?.accessToken as string | undefined;
        const refreshToken = data?.data?.refreshToken as string | undefined;

        token.accessToken = accessToken;
        token.refreshToken = refreshToken || token.refreshToken;
        if (accessToken) {
          token.accessTokenExpires = getAccessTokenExpires(accessToken);
        }
      } catch (error) {
        console.error("Refresh token error:", error);
        token.error = "RefreshAccessTokenError";
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...(session.user || {}),
        id: token.sub,
        email: token.email,
        name: token.name,
        userType: token.userType,
      } as typeof session.user & { id?: string; userType?: string };
      (session as any).accessToken = token.accessToken;
      (session as any).error = token.error;
      (session as any).verificationRequired = (
        token as any
      ).verificationRequired;
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
