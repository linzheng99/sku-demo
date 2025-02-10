import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import db from '@/lib/db';

import { createVariationsSchema } from '../schemas';

const app = new Hono()
  .get('/list', async (c) => {
    const variations = await db.variation.findMany({
      include: {
        options: true
      }
    })
    return c.json(variations)
  })
  .post('/', zValidator('json', createVariationsSchema), async (c) => {
    const { variations } = c.req.valid('json')

    // 创建变体类型和选项
    if (variations.length) {
      for (const variation of variations) {
        await db.variation.create({
          data: {
            name: variation.name,
            options: { create: variation.options.map(option => option) },
            required: variation.required,
          },
        })
      }
    }

    return c.json({ message: 'Variations created successfully' })
  })

export default app
