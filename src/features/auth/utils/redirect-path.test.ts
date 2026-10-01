import { describe, expect, it } from "vitest"
import { DEFAULT_REDIRECT_PATH, getLoginPath, parseRedirectPath } from "./redirect-path"

describe("parseRedirectPath", () => {
  it("keeps a path on this site", () => {
    expect(parseRedirectPath("/checkout")).toBe("/checkout")
  })

  it.each([["https://evil.example"], ["//evil.example"], ["/\\evil.example"], ["checkout"], [["/checkout", "/products"]], [undefined]])("falls back to the default for %j", (value: unknown) => {
    expect(parseRedirectPath(value)).toBe(DEFAULT_REDIRECT_PATH)
  })
})

describe("getLoginPath", () => {
  it("adds ?next= for a return path", () => {
    expect(getLoginPath("/checkout")).toBe("/login?next=%2Fcheckout")
  })

  it("leaves the default out of the URL", () => {
    expect(getLoginPath(DEFAULT_REDIRECT_PATH)).toBe("/login")
  })
})
