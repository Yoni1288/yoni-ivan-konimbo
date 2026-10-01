import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@/generated/prisma/client"

const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient }

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  return new PrismaClient({ adapter })
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient()

// Reuse one client across dev hot reloads instead of opening a new connection pool per reload.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
