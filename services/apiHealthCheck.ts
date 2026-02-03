// services/apiHealthCheck.ts
// API health check and error monitoring utilities

import { api } from "./api";

export interface HealthCheckResult {
  status: "healthy" | "degraded" | "unhealthy";
  message: string;
  latency: number;
  timestamp: string;
  details?: Record<string, unknown>;
}

/**
 * Check API health status
 */
export async function checkApiHealth(): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    const response = await api.get<{
      status: string;
      version: string;
      features: string[];
    }>("/health", { requiresAuth: false });

    const latency = Date.now() - startTime;

    if (response.success) {
      return {
        status: latency < 1000 ? "healthy" : "degraded",
        message: "API is operational",
        latency,
        timestamp: new Date().toISOString(),
        details: response.data,
      };
    }

    return {
      status: "degraded",
      message: response.error || "API returned unsuccessful response",
      latency,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: "unhealthy",
      message: error instanceof Error ? error.message : "API unreachable",
      latency: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Test critical API endpoints
 */
export async function runApiDiagnostics(): Promise<{
  overall: "pass" | "partial" | "fail";
  results: Array<{
    endpoint: string;
    status: "pass" | "fail";
    latency: number;
    error?: string;
  }>;
}> {
  const endpoints = [
    { name: "Health", path: "/health", requiresAuth: false },
    { name: "Jobs", path: "/jobs", requiresAuth: false },
    { name: "Profile", path: "/profile", requiresAuth: true },
  ];

  const results = await Promise.all(
    endpoints.map(async (endpoint) => {
      const startTime = Date.now();
      try {
        const response = await api.get(endpoint.path, {
          requiresAuth: endpoint.requiresAuth,
        });
        return {
          endpoint: endpoint.name,
          status: (response.success ? "pass" : "fail") as "pass" | "fail",
          latency: Date.now() - startTime,
          error: response.error,
        };
      } catch (error) {
        return {
          endpoint: endpoint.name,
          status: "fail" as const,
          latency: Date.now() - startTime,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),
  );

  const passCount = results.filter((r) => r.status === "pass").length;
  const overall =
    passCount === results.length ? "pass" : passCount > 0 ? "partial" : "fail";

  return { overall, results };
}

/**
 * API error logger for debugging
 */
export function logApiError(
  endpoint: string,
  error: unknown,
  context?: Record<string, unknown>,
): void {
  const errorLog = {
    timestamp: new Date().toISOString(),
    endpoint,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context,
  };

  console.error("[API Error]", JSON.stringify(errorLog, null, 2));

  // In production, you would send this to an error tracking service
  // Example: Sentry.captureException(error, { extra: context });
}

export default {
  checkApiHealth,
  runApiDiagnostics,
  logApiError,
};
