import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { graphql } from 'graphql'
import { schema } from './schema'

export function createServer() {
  const server = new Koa()

  server.use(bodyParser())

  server.use(async (ctx, next) => {
    if (ctx.request.path === '/' && ctx.request.method === 'GET') {
      ctx.body = { status: 'ok' }
    }
    next()
  })

  server.use(async (ctx, next) => {
    if (ctx.request.path === '/graphql' && ctx.request.method === 'POST') {
      const res = await graphql(schema, ctx.request.body.query, ctx.request.body.variables)
      ctx.body = res
    }
    next()
  })

  return server
}
