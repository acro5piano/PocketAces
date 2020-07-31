import { Container } from 'typedi'
import { showBoxMessage } from './utils'
import { HttpService } from './services/HttpService'
import { GraphQLService } from './services/GraphQLService'
import { ConfigService } from './services/ConfigService'
import { DatabaseService } from './services/DatabaseService'

export class PocketAces {
  get http() {
    return Container.get(HttpService)
  }

  get database() {
    return Container.get(DatabaseService)
  }

  get graphql() {
    return Container.get(GraphQLService)
  }

  get config() {
    return Container.get(ConfigService)
  }

  initialize() {
    this.database.initialize()
  }

  runApplication() {
    const port = Number(process.env.PORT || 3000)
    this.http.initialize().start(port)
    showBoxMessage`
    PocketAces is Running

    - Listening:     http://0.0.0.0:${port}
    - GraphQL URL:   http://0.0.0.0:${port}/graphql
  `
    return this.http.server
  }

  registerDirective = this.graphql.registerDirective

  registerResolver = this.graphql.registerResolver

  buildSchema = this.graphql.buildSchema

  configureDatabase = this.config.configureDatabase

  sql = (q: string) => this.database.db.raw(q)
}
