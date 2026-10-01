import type { ErrorLog } from "./errors.types"

// Placeholder until a real error-reporting service exists; replace the body here and every caller follows.
export const sendError = (log: ErrorLog): void => {
  console.error(log.error)
}
