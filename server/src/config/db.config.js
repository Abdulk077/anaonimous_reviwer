// 1. Force dotenv to load BEFORE any PrismaClient reads process.env
import "dotenv/config"; 

import { PrismaClient } from "@prisma/client";

// 🔴 Primary Instance (Write queries: create, update, delete)
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// 🟢 Read Replica Instance (Read queries: findMany, findUnique, count)
export const prismaRead = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_READ_URL || process.env.DATABASE_URL,
    },
  },
});

// 🛡️ Resilient Boot Connection Handler
export const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️ DATABASE_URL not set in environment — skipping DB connection");
    return;
  }
  try {
    // Connect Primary
    await prisma.$connect();
    
    // Connect Replica (If replica fails or isn't running on Linux, swallow error cleanly)
    await prismaRead.$connect().catch((err) => {
      console.warn("⚠️ Read Replica connection failed (falling back):", err.message);
    });

    console.log("✅ Primary and Read DB instances initialized!");
  } catch (err) {
    console.warn("⚠️ Primary DB failed to connect:", err.message);
    // Server stays alive due to your Resilient Boot pattern!
  }
};

export default prisma;