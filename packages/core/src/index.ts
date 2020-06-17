import './bootstrap'
import { Container } from 'typedi'
import { HttpService } from 'src/services/HttpService'
import { GraphQLService } from 'src/services/GraphQLService'
import { ConfigService } from 'src/services/ConfigService'
import { DatabaseService } from 'src/services/DatabaseService'
import { showBoxMessage } from 'src/utils'

export const registerDirective = Container.get(GraphQLService).registerDirective
export const registerResolver = Container.get(GraphQLService).registerResolver
export const buildSchema = Container.get(GraphQLService).buildSchema
export const configureDatabase = Container.get(ConfigService).configureDatabase
export const sql = (q: string) => Container.get(DatabaseService).db.raw(q)

export function initialize() {
  Container.get(DatabaseService).initialize()
}

export async function runApplication() {
  const port = Number(process.env.PORT || 3000)
  Container.get(HttpService).initialize().start(port)
  showBoxMessage`
    PocketAce is Running

    - Listening:     http://0.0.0.0:${port}
    - GraphQL URL:   http://0.0.0.0:${port}/graphql
  `
  return Container.get(HttpService).server
}
