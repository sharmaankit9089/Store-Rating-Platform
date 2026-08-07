import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

async function main() {
  console.log("Seeding database...");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("Password@123", salt);

  // 1. Create Admin
  await prisma.user.upsert({
    where: { email: "admin@store.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@store.com",
      password: hashedPassword,
      address: "Admin Headquarters",
      role: "ADMIN",
    },
  });

  // 2. Create Owners & Stores
  const owner1 = await prisma.user.upsert({
    where: { email: "owner1@store.com" },
    update: {},
    create: {
      name: "Owner One",
      email: "owner1@store.com",
      password: hashedPassword,
      address: "Pune",
      role: "OWNER",
      store: {
        create: {
          name: "Reliance Fresh",
          email: "reliancefresh@store.com",
          address: "Pune City Center",
        },
      },
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: "owner2@store.com" },
    update: {},
    create: {
      name: "Owner Two",
      email: "owner2@store.com",
      password: hashedPassword,
      address: "Mumbai",
      role: "OWNER",
      store: {
        create: {
          name: "D-Mart",
          email: "dmart@store.com",
          address: "Mumbai Andheri",
        },
      },
    },
  });

  // 3. Create 5 Users
  for (let i = 1; i <= 5; i++) {
    await prisma.user.upsert({
      where: { email: `user${i}@gmail.com` },
      update: {},
      create: {
        name: `Normal User ${i}`,
        email: `user${i}@gmail.com`,
        password: hashedPassword,
        address: `User Address ${i}`,
        role: "USER",
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
