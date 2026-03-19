import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seed admin user
  const adminEmail = "admin@handi.ng";
  const adminPassword = "Ruggedmr80@@";

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (existing) {
    console.log(`Admin user already exists: ${adminEmail}`);
  } else {
    const hash = await bcrypt.hash(adminPassword, 12);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        firstName: "Admin",
        lastName: "HANDI",
        passwordHash: hash,
        userType: "ADMIN",
        adminRole: "SUPER_ADMIN",
        isVerified: true,
        isEmailVerified: true,
        verificationStatus: "VERIFIED",
        verificationLevel: "CERTIFIED",
      },
    });
    console.log(`Created admin user: ${admin.email} (${admin.id})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
