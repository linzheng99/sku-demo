import { Hono } from 'hono'

const app = new Hono()
  .get('/', (c) => c.text('Hello product!'))

export default app
