import { z } from "zod"

export const categorySchema = z.object({
  id: z.string(),
  title: z.string(),
  handle: z.string(),
  count: z.number().int().min(0),
})

export const categoryFilterSchema = z.object({
  total: z.number().int().min(0),
  collections: z.array(categorySchema),
})
