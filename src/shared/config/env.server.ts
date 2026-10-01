import "server-only"
import { z } from "zod"

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),
  APP_URL: z.url(),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

export const env: ServerEnv = serverEnvSchema.parse(process.env)
