// prisma/seed.ts
// Seed database with initial data (production-ready)

import { PrismaClient, UserType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create categories
  const categories = [
    {
      name: "Electrician",
      icon: "flash-outline",
      subServices: [
        "Wiring",
        "AC Repair",
        "Generator Repair",
        "Socket Installation",
      ],
    },
    {
      name: "Plumber",
      icon: "water-outline",
      subServices: ["Pipe Repair", "Installation", "Drainage", "Water Heater"],
    },
    {
      name: "Carpenter",
      icon: "construct-outline",
      subServices: ["Furniture Repair", "Cabinet Making", "Door Installation"],
    },
    {
      name: "Painter",
      icon: "color-palette-outline",
      subServices: ["House Painting", "Wall Design", "POP Ceiling"],
    },
    {
      name: "Cleaner",
      icon: "sparkles-outline",
      subServices: ["House Cleaning", "Deep Cleaning", "Office Cleaning"],
    },
    {
      name: "Mechanic",
      icon: "car-outline",
      subServices: [
        "Car Repair",
        "AC Service",
        "Brake Repair",
        "Engine Repair",
      ],
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: {
        name: cat.name,
        icon: cat.icon,
        subServices: JSON.stringify(cat.subServices),
      },
    });
  }
  console.log("✅ Categories created");

  // Admin (Super Admin)
  const adminPasswordHash = await bcrypt.hash("Ruggedmr80@@", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@handiapp.com.ng" },
    update: {
      passwordHash: adminPasswordHash,
      adminRole: "SUPER_ADMIN",
      isVerified: true,
      isEmailVerified: true,
    },
    create: {
      email: "admin@handiapp.com.ng",
      phone: "+2348145678901",
      passwordHash: adminPasswordHash,
      firstName: "Super",
      lastName: "Admin",
      userType: UserType.ADMIN,
      adminRole: "SUPER_ADMIN",
      isVerified: true,
      isEmailVerified: true,
      wallet: {
        create: { balance: 0 },
      },
    },
  });
  console.log("✅ Admin created:", admin.email);

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
