import { randomBytes, scrypt, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"

const scryptAsync = promisify(scrypt) as (password: string, salt: Buffer, keyLength: number) => Promise<Buffer>

const SALT_BYTES: number = 16
const KEY_LENGTH: number = 64
const HASH_PREFIX: string = "scrypt"

// Stored as "scrypt$<salt>$<hash>" so the algorithm can change later without breaking existing rows.
// No server-only import: prisma/seed.ts runs outside Next.js and hashes the admin password with this.
export const hashPassword = async (password: string): Promise<string> => {
  const salt: Buffer = randomBytes(SALT_BYTES)
  const hash: Buffer = await scryptAsync(password, salt, KEY_LENGTH)
  return `${HASH_PREFIX}$${salt.toString("hex")}$${hash.toString("hex")}`
}

export const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {
  const [prefix, saltHex, hashHex] = storedHash.split("$")

  if (prefix !== HASH_PREFIX || !saltHex || !hashHex) {
    return false
  }

  const expectedHash: Buffer = Buffer.from(hashHex, "hex")

  if (!expectedHash.length) {
    return false
  }

  const actualHash: Buffer = await scryptAsync(password, Buffer.from(saltHex, "hex"), expectedHash.length)
  // Constant-time comparison so response timing doesn't reveal how much of the hash matched.
  return timingSafeEqual(actualHash, expectedHash)
}
