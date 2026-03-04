import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// Singleton PrismaClient with Accelerate extension for prisma+postgres:// protocol
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof makePrisma> | undefined;
};

function makePrisma() {
  return new PrismaClient().$extends(withAccelerate());
}

export const prisma = globalForPrisma.prisma ?? makePrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
