import { z } from "zod"

export const createProductItemSchema = z.object({
  price: z.string(),
  qtyInStock: z.string(),
})

export const configurationsSchema = z.array(z.object({
  variationId: z.string(),
  variationOptionId: z.string(),
}))

export const createProductItemRequestSchema = z.object({
  productId: z.string(),
  sku: z.string(),
  price: z.string(),
  qtyInStock: z.string(),
  configurations: z.array(z.object({
    variationId: z.string(),
    variationOptionId: z.string(),
  }))
})
