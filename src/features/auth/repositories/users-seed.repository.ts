import type { PrismaClient } from "@/generated/prisma/client"
import { hashPassword } from "@/shared/auth/password"
import type { SeedAdmin } from "../auth.types"

// Upsert because the seed runs on every Docker start; it rehashes so a changed SEED_ADMIN_PASSWORD takes effect. Other users and orders are never touched.
// Takes the client as a parameter for the same reason as replaceAllProducts: the shared client depends on the server-only env module.
export const upsertAdminUser = async (client: PrismaClient, admin: SeedAdmin): Promise<void> => {
  const { userName, password, email } = admin
  const passwordHash: string = await hashPassword(password)

  await client.user.upsert({
    where: { userName },
    create: { userName, passwordHash, email },
    update: { passwordHash, email },
  })
}
