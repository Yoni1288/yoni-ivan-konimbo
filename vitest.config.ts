import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

// Loaded before anything else so the test database URL wins over .env (dotenv never overrides existing variables).
process.loadEnvFile(".env.test")

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    globalSetup: ["./vitest.global-setup.ts"],
  },
})
