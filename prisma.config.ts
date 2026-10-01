import "dotenv/config"
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Read directly instead of env(), which throws when unset: `prisma generate` must work on a clean clone without a .env.
    url: process.env.DATABASE_URL ?? "",
  },
})
