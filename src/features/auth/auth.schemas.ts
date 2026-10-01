import { z } from "zod"

// Usernames are stored lowercase, so "Admin" and "admin" are the same account on register and sign-in.
export const loginSchema = z.object({
  username: z.string().trim().toLowerCase().min(1, "Enter your username"),
  password: z.string().min(1, "Enter your password"),
})

// The rules the register route enforces; the form adds the confirmation field on top.
export const registerCredentialsSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9._]{3,20}$/, "Use 3–20 letters, numbers, dots or underscores"),
  password: z.string().min(8, "Use at least 8 characters").max(128, "Use at most 128 characters"),
})

export const registerFormSchema = registerCredentialsSchema
  .extend({ confirmPassword: z.string().min(1, "Confirm your password") })
  .refine(({ password, confirmPassword }) => password === confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] })

// Where to go after sign-in, from `?next=`. Only paths on this site: it must start with "/" but not "//" or "/\",
// which browsers treat as another host, so the link can't be used to send users to a different website.
export const redirectPathSchema = z.string().regex(/^\/(?![/\\])/)

export const loginResponseSchema = z.object({
  token: z.string().min(1),
  expiresAt: z.iso.datetime(),
  user: z.object({ id: z.number().int().positive(), userName: z.string(), email: z.string().nullable() }),
})

// Read only by prisma/seed.ts, so they are not part of the app's env.server.ts.
export const seedAdminEnvSchema = z
  .object({
    SEED_ADMIN_USERNAME: z.string().trim().min(1),
    SEED_ADMIN_PASSWORD: z.string().min(1),
    SEED_ADMIN_EMAIL: z.email().optional(),
  })
  .transform((env) => ({ userName: env.SEED_ADMIN_USERNAME, password: env.SEED_ADMIN_PASSWORD, email: env.SEED_ADMIN_EMAIL }))
