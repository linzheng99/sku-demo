import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import category from '@/features/category/server/route'
import product from '@/features/product/server/route'
import productItem from '@/features/productItem/server/route'
import variation from '@/features/variation/server/route'

const app = new Hono().basePath('/api')

export const routes = app
  .route('/category', category)
  .route('/product', product)
  .route('/variation', variation)
  .route('/productItem', productItem)

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
