import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected!");
  } catch (err) {
    console.error("❌ Connection error:", err.message);
    process.exit(1);
  }
};

export default prisma;
