// src/middleware/auth.ts
// JWT Authentication middleware

import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export interface JWTPayload {
  userId: string;
  email: string;
  userType: string;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
        statusCode: 401,
      });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET not configured");
    }

    const decoded = jwt.verify(token, secret) as JWTPayload;

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        userType: true,
        verificationStatus: true,
      },
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

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: "Token expired",
        statusCode: 401,
      });
    }
    return res.status(401).json({
      success: false,
      error: "Invalid token",
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
