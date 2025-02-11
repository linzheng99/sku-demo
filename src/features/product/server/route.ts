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

    // // 重构数据结构
    // const variations = {}
    // const configurations = []
    // const availableOptions = {}

    // product.productItems.forEach(item => {
    //   const config = {
    //     id: item.id,
    //     sku: item.sku,
    //     price: item.price,
    //     qtyInStock: item.qtyInStock,
    //     combination: {}
    //   }

    //   item.configurations.forEach(conf => {
    //     const { variation, variationOption } = conf

    //     // 构建 variations 对象
    //     if (!variations[variation.id]) {
    //       variations[variation.id] = {
    //         id: variation.id,
    //         name: variation.name,
    //         options: []
    //       }
    //     }
    //     if (!variations[variation.id].options.some(opt => opt.id === variationOption.id)) {
    //       variations[variation.id].options.push({
    //         id: variationOption.id,
    //         value: variationOption.value
    //       })
    //     }

    //     // 构建 configuration 组合
    //     config.combination[variation.id] = variationOption.id

    //     // 构建 availableOptions 对象
    //     if (!availableOptions[variation.id]) {
    //       availableOptions[variation.id] = {}
    //     }
    //     if (!availableOptions[variation.id][variationOption.id]) {
    //       availableOptions[variation.id][variationOption.id] = new Set()
    //     }
    //     Object.entries(config.combination).forEach(([varId, optId]) => {
    //       if (varId !== variation.id) {
    //         availableOptions[varId][optId].add(variationOption.id)
    //         availableOptions[variation.id][variationOption.id].add(optId)
    //       }
    //     })
    //   })

    //   configurations.push(config)
    // })

    // // 将 Set 转换为数组
    // Object.keys(availableOptions).forEach(varId => {
    //   Object.keys(availableOptions[varId]).forEach(optId => {
    //     availableOptions[varId][optId] = Array.from(availableOptions[varId][optId])
    //   })
    // })

    // const optimizedProduct = {
    //   ...product,
    //   variations: Object.values(variations),
    //   configurations,
    //   availableOptions
    // }

    // delete optimizedProduct.productItems // 移除原始的 productItems

    // return c.json(optimizedProduct)
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
