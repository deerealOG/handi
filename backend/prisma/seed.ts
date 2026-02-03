// prisma/seed.ts
// Seed database with initial data

import { BookingStatus, PrismaClient, UserType } from "@prisma/client";
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
        subServices: JSON.stringify(cat.subServices), // JSON string for SQLite
      },
    });
  }
  console.log("✅ Categories created");

  // Create test users
  const passwordHash = await bcrypt.hash("password123", 12);

  // Test Client
  const client = await prisma.user.upsert({
    where: { email: "client@test.com" },
    update: {},
    create: {
      email: "client@test.com",
      phone: "+2348123456789",
      passwordHash,
      firstName: "John",
      lastName: "Adebayo",
      userType: UserType.CLIENT,
      isVerified: true,
      isEmailVerified: true,
      city: "Lagos",
      state: "Lagos",
      address: "123 Victoria Island, Lagos",
      wallet: {
        create: { balance: 50000 },
      },
    },
  });
  console.log("✅ Test client created:", client.email);

  // Test Artisan
  const artisan = await prisma.user.upsert({
    where: { email: "artisan@test.com" },
    update: {},
    create: {
      email: "artisan@test.com",
      phone: "+2348034567890",
      passwordHash,
      firstName: "Golden",
      lastName: "Amadi",
      userType: UserType.ARTISAN,
      isVerified: true,
      isEmailVerified: true,
      city: "Lagos",
      state: "Lagos",
      address: "45 Yaba, Lagos",
      skills: JSON.stringify(["Electrician", "AC Repair", "Generator Repair"]), // JSON string
      bio: "Experienced electrician with 5+ years of experience",
      rating: 4.8,
      totalJobs: 45,
      isOnline: true,
      wallet: {
        create: { balance: 125000, pendingBalance: 8000 },
      },
    },
  });
  console.log("✅ Test artisan created:", artisan.email);

  // Test Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      phone: "+2348145678901",
      passwordHash,
      firstName: "Admin",
      lastName: "User",
      userType: UserType.ADMIN,
      isVerified: true,
      isEmailVerified: true,
    },
  });
  console.log("✅ Test admin created:", admin.email);

  // Create sample bookings
  const bookings = [
    {
      clientId: client.id,
      artisanId: artisan.id,
      categoryId: "electrician",
      categoryName: "Electrician",
      serviceType: "Wiring Installation",
      description: "Need to install new wiring in the living room",
      scheduledDate: new Date("2026-01-28"),
      scheduledTime: "10:00 AM",
      address: "123 Victoria Island, Lagos",
      city: "Lagos",
      estimatedPrice: 15000,
      status: BookingStatus.IN_PROGRESS,
    },
    {
      clientId: client.id,
      artisanId: artisan.id,
      categoryId: "electrician",
      categoryName: "Electrician",
      serviceType: "AC Repair",
      description: "AC not cooling properly",
      scheduledDate: new Date("2026-01-29"),
      scheduledTime: "2:00 PM",
      address: "456 Lekki Phase 1, Lagos",
      city: "Lagos",
      estimatedPrice: 8000,
      status: BookingStatus.PENDING,
    },
    {
      clientId: client.id,
      artisanId: artisan.id,
      categoryId: "electrician",
      categoryName: "Electrician",
      serviceType: "Generator Repair",
      description: "Generator making strange noise",
      scheduledDate: new Date("2026-01-25"),
      scheduledTime: "11:00 AM",
      address: "789 Surulere, Lagos",
      city: "Lagos",
      estimatedPrice: 12000,
      finalPrice: 12000,
      status: BookingStatus.COMPLETED,
      completedAt: new Date("2026-01-25T14:00:00Z"),
    },
  ];

  for (const booking of bookings) {
    await prisma.booking.create({
      data: booking,
    });
  }
  console.log("✅ Sample bookings created");

  // Add wallet transactions for artisan
  const artisanWallet = await prisma.wallet.findUnique({
    where: { userId: artisan.id },
  });

  if (artisanWallet) {
    await prisma.walletTransaction.createMany({
      data: [
        {
          walletId: artisanWallet.id,
          type: "EARNING",
          amount: 12000,
          status: "COMPLETED",
          reference: "EARN-001",
          description: "Payment for Generator Repair job",
        },
        {
          walletId: artisanWallet.id,
          type: "EARNING",
          amount: 35000,
          status: "COMPLETED",
          reference: "EARN-002",
          description: "Payment for Wiring Installation job",
        },
        {
          walletId: artisanWallet.id,
          type: "WITHDRAWAL",
          amount: 20000,
          status: "COMPLETED",
          reference: "WD-001",
          description: "Withdrawal to GTBank",
          bankName: "GTBank",
          accountNumber: "0123456789",
          accountName: "Golden Amadi",
        },
      ],
    });
    console.log("✅ Wallet transactions created");
  }

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
