import crypto from "crypto";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || "15m";
const REFRESH_TOKEN_TTL_DAYS = parseInt(
  process.env.REFRESH_TOKEN_TTL_DAYS || "30",
  10,
);

export interface AccessTokenPayload {
  userId: string;
  email: string;
  userType: string;
}

export const createAccessToken = (payload: AccessTokenPayload): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not configured");
  }
  return jwt.sign(
    {
      sub: payload.userId,
      userId: payload.userId,
      email: payload.email,
      userType: payload.userType,
    },
    secret,
    { expiresIn: ACCESS_TOKEN_TTL },
  );
};

export const generateRefreshToken = (): string =>
  crypto.randomBytes(48).toString("hex");

export const hashToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

export const refreshTokenExpiresAt = (): Date => {
  const expires = new Date();
  expires.setDate(expires.getDate() + REFRESH_TOKEN_TTL_DAYS);
  return expires;
};

export const generateOtp = (): string => {
  const code = crypto.randomInt(0, 1000000);
  return code.toString().padStart(6, "0");
};

