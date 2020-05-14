import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { Service, Inject } from 'typedi'
import { GraphQLService } from './GraphQLService'
import { ReloationLoader } from 'src/database/ReloationLoader'
import { getUserFromToken } from 'src/auth/Auth'
import { GraphQLError, ExecutionResult } from 'graphql'
import { TokenExpiredError } from 'jsonwebtoken'

@Service()
export class HttpService {
  @Inject()
  graphql!: GraphQLService

  @Inject()
  relationLoader!: ReloationLoader

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
      if (ctx.request.header.authorization) {
        try {
          const user = getUserFromToken(ctx.request.header.authorization)
          Object.assign(ctx.state, { user })
        } catch (e) {
          if (e instanceof TokenExpiredError) {
            ctx.body = {
              errors: [new GraphQLError('jwt_expired')],
            } as ExecutionResult
            return
          } else {
            throw e
          }
        }
      }
      return next()
    })

    this.server.use(async (ctx, next) => {
      if (ctx.request.path === '/graphql' && ctx.request.method === 'POST') {
        const res = await this.graphql.schema.executeGraphQL({
          query: ctx.request.body.query,
          variables: ctx.request.body.variables,
          context: ctx.state,
        })
        ctx.body = res
        this.relationLoader.clear()
      }
      return next()
    })

    return this
  }

  start(port = 3000) {
    const serverInstance = this.server.listen(port)
    process.on('exit', () => {
      serverInstance.close()
    })
    return this
  }
}
