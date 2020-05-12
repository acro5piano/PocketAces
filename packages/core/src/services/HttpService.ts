import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { Service, Inject } from 'typedi'
import { GraphQLService } from './GraphQLService'

@Service()
export class HttpService {
  @Inject()
  graphql!: GraphQLService

  server = new Koa()

  initialize() {
    this.server.use(bodyParser())

    this.server.use(async (ctx, next) => {
      if (ctx.request.path === '/' && ctx.request.method === 'GET') {
        ctx.body = { status: 'ok' }
      }
      return next()
    })

    this.server.use(async (ctx, next) => {
      if (ctx.request.path === '/graphql' && ctx.request.method === 'POST') {
        const res = await this.graphql.schema.executeGraphQL({
          query: ctx.request.body.query,
          variables: ctx.request.body.variables,
        })
        ctx.body = res
      }
      return next()
    })

    return this
  }

  start(port = 3000) {
    this.server.listen(port)
    return this
  }
}
