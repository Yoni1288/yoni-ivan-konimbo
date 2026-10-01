import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

// Loaded here rather than in setupFiles: globalSetup runs first and its migrate and seed must already target the test database.
process.loadEnvFile(".env.test")

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // server-only throws outside a React Server Components build, so tests use its no-op variant.
      "server-only": fileURLToPath(new URL("./node_modules/server-only/empty.js", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    globalSetup: ["./vitest.global-setup.ts"],
  },
})
