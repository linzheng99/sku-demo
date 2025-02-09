import { z } from "zod"

export const createProductSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  categoryId: z.string(),
})
