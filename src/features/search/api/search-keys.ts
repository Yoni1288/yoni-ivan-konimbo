export const searchKeys = {
  all: ["search"] as const,
  suggestions: (term: string) => [...searchKeys.all, "suggestions", term] as const,
}
