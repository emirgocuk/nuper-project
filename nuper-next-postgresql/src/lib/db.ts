import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

let connectionString = process.env.DATABASE_URL || '';
const isLocalhost = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

if (!isLocalhost && connectionString.includes("sslmode=require")) {
    connectionString = connectionString.replace("sslmode=require", "sslmode=no-verify");
}

const pool = new Pool({ 
    connectionString,
    ssl: isLocalhost ? false : {
        rejectUnauthorized: false
    }
});
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
