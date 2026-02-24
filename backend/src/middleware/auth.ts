// src/middleware/auth.ts
// JWT Authentication middleware

import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export interface JWTPayload {
  userId: string;
  email?: string;
  userType?: string;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const jwtCheck = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.header("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : undefined;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Missing access token",
        statusCode: 401,
      });
    }

    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        error: "JWT_ACCESS_SECRET is not configured",
        statusCode: 500,
      });
    }

    const payload = jwt.verify(token, secret) as JWTPayload & {
      sub?: string;
    };
    const userId = payload.userId || payload.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Invalid token payload",
        statusCode: 401,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, userType: true, verificationStatus: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found",
        statusCode: 401,
      });
    }

    if (user.verificationStatus === "BANNED") {
      return res.status(403).json({
        success: false,
        error: "Account suspended",
        statusCode: 403,
      });
    }

    req.user = {
      userId: user.id,
      email: user.email,
      userType: user.userType,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      success: false,
      error: "Authentication failed",
      statusCode: 401,
    });
  }
};

// Middleware to check if user is an artisan
export const requireArtisan = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.userType !== "ARTISAN") {
    return res.status(403).json({
      success: false,
      error: "Artisan access required",
      statusCode: 403,
    });
  }
  next();
};

// Middleware to check if user is admin
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.userType !== "ADMIN") {
    return res.status(403).json({
      success: false,
      error: "Admin access required",
      statusCode: 403,
    });
  }
  next();
};

// Middleware to check if user is a business
export const requireBusiness = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.userType !== "BUSINESS") {
    return res.status(403).json({
      success: false,
      error: "Business access required",
      statusCode: 403,
    });
  }
  next();
};
