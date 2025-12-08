// import { PrismaClient } from '@prisma/client'

// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// export const prisma = globalForPrisma.prisma || new PrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Mock for build without DB
export const prisma = {
    event: { findMany: async () => [] },
    bulletin: { findMany: async () => [] },
    // ... add others if needed
} as any;
