import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const prismaRead = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_READ_URL || process.env.DATABASE_URL }
  }
});

export const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️ DATABASE_URL not set — skipping DB connection");
    return;
  }
  try {
    await prisma.$connect();
    await prismaRead.$connect();
    console.log("✅ Database connected!");
  } catch (err) {
    console.warn("⚠️ DB not connected:", err.message);
  }
};

export default prisma;