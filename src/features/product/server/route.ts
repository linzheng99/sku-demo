import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import db from '@/lib/db';

import { createProductSchema } from '../schemas';

const app = new Hono()
  .get('/list', async (c) => {
    const products = await db.product.findMany()
    return c.json(products)
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
