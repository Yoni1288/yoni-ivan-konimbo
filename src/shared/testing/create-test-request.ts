import { NextRequest } from "next/server"
import { env } from "@/shared/config/env.server"

export const createTestRequest = (path: string): NextRequest => {
  return new NextRequest(new URL(path, env.APP_URL))
}
