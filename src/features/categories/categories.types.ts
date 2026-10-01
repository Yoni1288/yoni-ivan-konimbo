import type { z } from "zod"
import type { categoryFilterSchema, categorySchema } from "./categories.schemas"

export type Category = z.infer<typeof categorySchema>

export type CategoryFilter = z.infer<typeof categoryFilterSchema>
