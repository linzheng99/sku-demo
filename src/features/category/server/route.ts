import { zValidator } from "@hono/zod-validator";
import { Hono } from 'hono';

import db from '@/lib/db';

import { createCategorySchema } from '../schemas';

const app = new Hono()
  .get('/list', async (c) => {
    const categories = await db.category.findMany()
    return c.json(categories)
  })
  .post('/',
    zValidator('json', createCategorySchema),
    async (c) => {
      const { name } = c.req.valid('json')
      const existingCategory = await db.category.findFirst({
        where: { name },
      })

      if (existingCategory) {
        return c.json({ error: 'Category already exists' }, 400)
      }

      const category = await db.category.create({
        data: { name },
      })

      return c.json(category)
    })
  .delete('/:categoryId', async (c) => {
    const { categoryId } = c.req.param()

    await db.category.delete({ where: { id: categoryId } })

    return c.json({ message: 'Category deleted' })
  })

export default app
