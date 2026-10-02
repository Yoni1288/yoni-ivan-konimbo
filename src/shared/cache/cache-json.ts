import "server-only"
import type { z } from "zod"
import { sendError } from "@/shared/errors/send-error"
import { redis } from "./redis"

// The cache is an optimization: a Redis outage or a bad cached value is reported and treated as a miss, never as a failed request.
const readCachedJson = async <T>(key: string, schema: z.ZodType<T>): Promise<T | null> => {
  try {
    const cached: string | null = await redis.get(key)

    if (cached === null) {
      return null
    }

    return schema.parse(JSON.parse(cached))
  } catch (error) {
    sendError({ error })
    return null
  }
}

const writeCachedJson = async (key: string, value: unknown, ttlSeconds: number): Promise<void> => {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds)
  } catch (error) {
    sendError({ error })
  }
}

export const getOrSetJson = async <T>(key: string, ttlSeconds: number, schema: z.ZodType<T>, load: () => Promise<T>): Promise<T> => {
  const cached: T | null = await readCachedJson(key, schema)

  if (cached !== null) {
    return cached
  }

  const value: T = await load()
  await writeCachedJson(key, value, ttlSeconds)
  return value
}
