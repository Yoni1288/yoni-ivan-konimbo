import Redis from "ioredis"
import { env } from "@/shared/config/env.server"

const globalForRedis = globalThis as typeof globalThis & { redis?: Redis }

const createRedisClient = (): Redis => {
  // lazyConnect keeps `next build` and tests from opening a connection until a command actually runs.
  return new Redis(env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 3 })
}

export const redis: Redis = globalForRedis.redis ?? createRedisClient()

// Reuse one client across dev hot reloads instead of opening a new connection per reload.
if (env.NODE_ENV !== "production") {
  globalForRedis.redis = redis
}
