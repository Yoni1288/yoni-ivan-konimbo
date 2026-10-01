import { execSync } from "node:child_process"

// Creates the test database if needed, applies migrations and seeds it before any test runs.
export default function setupTestDatabase(): void {
  execSync("pnpm prisma migrate deploy", { stdio: "inherit" })
  execSync("pnpm prisma db seed", { stdio: "inherit" })
}
