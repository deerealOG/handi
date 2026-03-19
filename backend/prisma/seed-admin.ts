// prisma/seed-admin.ts
// Creates admin users. Run: npx tsx prisma/seed-admin.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Only use roles that exist in the current database schema
// CONTENT_MANAGER and DATA_ANALYST need a migration first
const ADMINS = [
  {
    email: "superadmin@handi.ng",
    firstName: "Super",
    lastName: "Admin",
    password: "Ruggedmr80@@",
    adminRole: "SUPER_ADMIN" as const,
  },
  {
    email: "moderator@handi.ng",
    firstName: "John",
    lastName: "Moderator",
    password: "ModHandi2026!",
    adminRole: "MODERATOR" as const,
  },
  {
    email: "support@handi.ng",
    firstName: "Ada",
    lastName: "Support",
    password: "SupportHandi2026!",
    adminRole: "SUPPORT" as const,
  },
  {
    email: "finance@handi.ng",
    firstName: "Silas",
    lastName: "Finance",
    password: "FinanceHandi2026!",
    adminRole: "FINANCE" as const,
  },
];

async function main() {
  for (const admin of ADMINS) {
    const passwordHash = await bcrypt.hash(admin.password, 10);

    const existing = await prisma.user.findUnique({
      where: { email: admin.email },
    });

    if (existing) {
      await prisma.user.update({
        where: { email: admin.email },
        data: {
          passwordHash,
          userType: "ADMIN",
          adminRole: admin.adminRole,
          isEmailVerified: true,
          isVerified: true,
          verificationStatus: "VERIFIED",
        },
      });
      console.log(`✅ Updated: ${admin.email} (${admin.adminRole})`);
    } else {
      await prisma.user.create({
        data: {
          email: admin.email,
          passwordHash,
          firstName: admin.firstName,
          lastName: admin.lastName,
          userType: "ADMIN",
          adminRole: admin.adminRole,
          isEmailVerified: true,
          isVerified: true,
          verificationStatus: "VERIFIED",
          wallet: { create: { balance: 0, pendingBalance: 0 } },
        },
      });
      console.log(`✅ Created: ${admin.email} (${admin.adminRole})`);
    }
  }

  // Clean up the old admin@handi.ng if it still exists
  const oldAdmin = await prisma.user.findUnique({
    where: { email: "admin@handi.ng" },
  });
  if (oldAdmin) {
    await prisma.user.delete({ where: { email: "admin@handi.ng" } });
    console.log("🧹 Removed old admin@handi.ng (replaced by superadmin@handi.ng)");
  }

  console.log("\n🎉 All admin accounts ready!\n");
  console.log("Login credentials:");
  for (const a of ADMINS) {
    console.log(`  ${a.adminRole.padEnd(16)} → ${a.email} / ${a.password}`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
