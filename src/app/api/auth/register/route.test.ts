import { NextRequest } from "next/server"
import { afterAll, describe, expect, it } from "vitest"
import type { LoginResponse } from "@/features/auth/auth.types"
import { env } from "@/shared/config/env.server"
import { prisma } from "@/shared/db/prisma"
import { POST } from "./route"

// Unique per run, because the seed never deletes users from the test database.
const NEW_USERNAME: string = `test_${Date.now().toString(36)}`

const createRegisterRequest = (body: unknown): NextRequest => {
  return new NextRequest(new URL("/api/auth/register", env.APP_URL), { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } })
}

afterAll(async () => {
  await prisma.user.deleteMany({ where: { userName: NEW_USERNAME } })
})

describe("POST /api/auth/register", () => {
  it("creates the user and signs them in", async () => {
    const response: Response = await POST(createRegisterRequest({ username: NEW_USERNAME, password: "a-good-password" }), undefined)
    const body: LoginResponse = await response.json()

    expect(response.status).toBe(201)
    expect(body.user.userName).toBe(NEW_USERNAME)
    expect(Number.isInteger(body.user.id)).toBe(true)
    expect(body.token.split(".")).toHaveLength(3)
  })

  it("stores the username lowercase, so a different case is the same account", async () => {
    const response: Response = await POST(createRegisterRequest({ username: NEW_USERNAME.toUpperCase(), password: "a-good-password" }), undefined)

    expect(response.status).toBe(409)
  })

  it("rejects a username that is already taken", async () => {
    const response: Response = await POST(createRegisterRequest({ username: "admin", password: "a-good-password" }), undefined)
    const body: unknown = await response.json()

    expect(response.status).toBe(409)
    expect(body).toEqual({ statusCode: 409, message: "That username is already taken" })
  })

  it("rejects a password shorter than 8 characters", async () => {
    const response: Response = await POST(createRegisterRequest({ username: "someone_new", password: "short" }), undefined)

    expect(response.status).toBe(400)
  })

  it("rejects a username with invalid characters", async () => {
    const response: Response = await POST(createRegisterRequest({ username: "no spaces!", password: "a-good-password" }), undefined)

    expect(response.status).toBe(400)
  })
})
