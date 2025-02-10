import { z } from "zod"

export const createVariationSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  options: z
    .array(
      z.object({
        value: z.string().min(1, {
          message: "Option must be at least 1 character.",
        }),
      })
    ).min(1, {
      message: "Options must be at least 1.",
    }),
  required: z.boolean(),
})

export const createVariationsSchema = z.object({
  variations: z.array(
    z.object({
      name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
      }),
      options: z.array(
        z.object({
          value: z.string().min(1, {
            message: "Option must be at least 1 character.",
          }),
        })).min(1, {
          message: "Options must be at least 1.",
        }),
      required: z.boolean(),
    })
  )
})

export const updateProductVariationsSchema = z.object({
  productId: z.string(),
  price: z.number(),
  qtyInStock: z.number(),
  variations: z.array(z.object({
    name: z.string(),
    options: z.array(z.object({
      value: z.string(),
    })),
    required: z.boolean(),
  })),
})
