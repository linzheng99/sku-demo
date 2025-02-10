import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import db from "@/lib/db";

import { createProductItemRequestSchema } from "../schemas";

const app = new Hono()
.post('/', zValidator('json', createProductItemRequestSchema), async (c) => {
  try {
    const body = await c.req.json();
    const result = createProductItemRequestSchema.safeParse(body);
    
    if (!result.success) {
      return c.json({ message: 'Invalid request', errors: result.error.errors }, 400);
    }

    const { productId, configurations, price, qtyInStock, sku } = result.data;

    // 数值验证
    const priceNumber = parseFloat(price);
    const qtyNumber = parseInt(qtyInStock);
    if (isNaN(priceNumber) || isNaN(qtyNumber)) {
      return c.json({ message: 'Invalid number format' }, 400);
    }

    // 验证外键存在
    for (const config of configurations) {
      const [variation, option] = await Promise.all([
        db.variation.findUnique({ where: { id: config.variationId } }),
        db.variationOption.findUnique({ where: { id: config.variationOptionId } })
      ]);
      
      if (!variation || !option) {
        return c.json({ 
          message: `Invalid configuration: Variation ${config.variationId} or Option ${config.variationOptionId} not found`
        }, 404);
      }
    }

    // 分步创建
    const productItem = await db.productItem.create({
      data: {
        productId,
        sku,
        productImage: '',
        price: priceNumber,
        qtyInStock: qtyNumber,
      }
    });

    await db.productConfiguration.createMany({
      data: configurations.map(config => ({
        productItemId: productItem.id,
        variationId: config.variationId,
        variationOptionId: config.variationOptionId
      }))
    });

    const fullProductItem = await db.productItem.findUnique({
      where: { id: productItem.id },
      include: {
        configurations: {
          include: {
            variation: true,
            variationOption: true
          }
        },
        product: true
      }
    });

    return c.json(fullProductItem);
  } catch (error) {
    console.error('Error:', error);
    return c.json({ message: 'Internal server error' }, 500);
  }
});

export default app
