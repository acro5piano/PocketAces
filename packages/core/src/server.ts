import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

export function createServer() {
  const server = new Koa()

  server.use(bodyParser())

  // server.use(async ctx => {
  //   ctx.body = ctx.request.body
  // })

  server.use(async ctx => {
    if (ctx.request.path === '/' && ctx.request.method === 'GET') {
      ctx.body = { status: 'ok' }
    }
  })

  return server
}
