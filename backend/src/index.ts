// src/index.ts
// HANDI Backend API Entry Point

import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

// Load environment variables
dotenv.config();

// Import routes
import aiRoutes from "./routes/ai";
import authRoutes from "./routes/auth";
import availabilityRoutes from "./routes/availability";
import businessRoutes from "./routes/business";
import disputesRoutes from "./routes/disputes";
import jobsRoutes from "./routes/jobs";
import materialsRoutes from "./routes/materials";
import profileRoutes from "./routes/profile";
import verificationRoutes from "./routes/verification";
import walletRoutes from "./routes/wallet";

// Import middleware
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

// ================================
// Middleware
// ================================
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

// Cache-Control — reduce egress for repeated reads
app.use((req, res, next) => {
  if (req.method === "GET") {
    if (req.path.startsWith("/api/auth")) {
      res.setHeader("Cache-Control", "no-store");
    } else {
      res.setHeader(
        "Cache-Control",
        "private, max-age=60, stale-while-revalidate=30",
      );
    }
  } else {
    res.setHeader("Cache-Control", "no-store");
  }
  next();
});

// ================================
// Health Check
// ================================
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "HANDI API is running",
    version: "2.0.0",
    features: [
      "auth",
      "jobs",
      "wallet",
      "profile",
      "verification",
      "materials",
      "availability",
      "disputes",
      "business",
      "ai",
    ],
    timestamp: new Date().toISOString(),
  });
});

// ================================
// API Routes
// ================================
// Core routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/profile", profileRoutes);

// Feature routes
app.use("/api/verification", verificationRoutes);
app.use("/api", materialsRoutes); // /api/jobs/:id/materials & /api/materials/:id
app.use("/api/availability", availabilityRoutes);
app.use("/api/disputes", disputesRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/ai", aiRoutes);

// ================================
// Error Handler
// ================================
app.use(errorHandler);

// ================================
// Start Server
// ================================
app.listen(PORT, () => {
  console.log(`🚀 HANDI API running on http://localhost:${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`✅ All 10 API modules loaded`);
});

export default app;
