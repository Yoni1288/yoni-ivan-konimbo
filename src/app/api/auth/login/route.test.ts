import { decodeJwt, type JWTPayload } from "jose"
import { NextRequest } from "next/server"
import { describe, expect, it } from "vitest"
import type { LoginResponse } from "@/features/auth/auth.types"
import { env } from "@/shared/config/env.server"
import { POST } from "./route"

const ONE_HOUR_MS: number = 60 * 60 * 1000
const ADMIN_USERNAME: string = process.env.SEED_ADMIN_USERNAME ?? ""
const ADMIN_PASSWORD: string = process.env.SEED_ADMIN_PASSWORD ?? ""

const createLoginRequest = (body: unknown): NextRequest => {
  return new NextRequest(new URL("/api/auth/login", env.APP_URL), { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } })
}

describe("POST /api/auth/login", () => {
  // Written out literally: this is the default admin that .env.example seeds, so a fresh clone can sign in with it.
  it("signs in with the default admin / admin credentials", async () => {
    const response: Response = await POST(createLoginRequest({ username: "admin", password: "admin" }), undefined)
    const body: LoginResponse = await response.json()

    expect(response.status).toBe(200)
    expect(body.user.userName).toBe("admin")
    expect(Number.isInteger(body.user.id)).toBe(true)
    expect(body.token.split(".")).toHaveLength(3)
  })

  it("returns a JWT that expires in one hour for valid credentials", async () => {
    const response: Response = await POST(createLoginRequest({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD }), undefined)
    const body: LoginResponse = await response.json()
    const payload: JWTPayload = decodeJwt(body.token)
    const expiresInMs: number = new Date(body.expiresAt).getTime() - Date.now()

    expect(response.status).toBe(200)
    expect(body.user.userName).toBe(ADMIN_USERNAME)
    expect(payload.sub).toBe(String(body.user.id))
    expect((payload.exp ?? 0) - (payload.iat ?? 0)).toBe(3600)
    expect(expiresInMs).toBeGreaterThan(ONE_HOUR_MS - 60_000)
    expect(expiresInMs).toBeLessThanOrEqual(ONE_HOUR_MS)
  })

  it("rejects a wrong password with a generic message", async () => {
    const response: Response = await POST(createLoginRequest({ username: ADMIN_USERNAME, password: "wrong-password" }), undefined)
    const body: unknown = await response.json()

    expect(response.status).toBe(401)
    expect(body).toEqual({ statusCode: 401, message: "Invalid username or password" })
  })

  it("rejects an unknown user with the same message", async () => {
    const response: Response = await POST(createLoginRequest({ username: "nobody", password: "whatever" }), undefined)
    const body: unknown = await response.json()

    expect(response.status).toBe(401)
    expect(body).toEqual({ statusCode: 401, message: "Invalid username or password" })
  })

  it("rejects a missing password", async () => {
    const response: Response = await POST(createLoginRequest({ username: ADMIN_USERNAME }), undefined)

    expect(response.status).toBe(400)
  })
})
