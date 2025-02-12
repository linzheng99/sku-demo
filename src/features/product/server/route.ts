import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import db from '@/lib/db';

import { createProductSchema } from '../schemas';

const app = new Hono()
  .get('/list', async (c) => {
    const products = await db.product.findMany()
    return c.json(products)
  })
  .get('/:id', async (c) => {
    const { id } = c.req.param()
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        productItems: {
          include: {
            configurations: {
              include: {
                variation: true,
                variationOption: true,
              },
            },
          },
        },
      },
    })

    if (!product) {
      return c.json({ error: 'Product not found' }, 404)
    }

    return c.json(product)
  })
  .post('/', zValidator('json', createProductSchema), async (c) => {
    const { name, description, categoryId } = await c.req.json()

    const product = await db.product.create({
      data: {
        name,
        description,
        categoryId,
      },
    })

    return c.json(product)
  })
  .delete('/:productId', async (c) => {
    const { productId } = c.req.param()

    const product = await db.product.delete({
      where: { id: productId },
    })

    return c.json(product)
  })

export default app
