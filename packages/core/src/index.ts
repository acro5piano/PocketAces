import { Container } from 'typedi'
import { HttpService } from 'src/services/HttpService'
import { GraphQLService } from 'src/services/GraphQLService'
import { ConfigService } from 'src/services/ConfigService'
import { DatabaseService } from 'src/services/DatabaseService'

export { BaseDirective } from 'src/directives/BaseDirective'

export const registerDirective = Container.get(GraphQLService).registerDirective
export const registerResolver = Container.get(GraphQLService).registerResolver
export const buildSchema = Container.get(GraphQLService).buildSchema
export const configureDatabase = Container.get(ConfigService).configureDatabase
export const sql = (q: string) => Container.get(DatabaseService).db.raw(q)

export function initialize() {
  Container.get(DatabaseService).initialize()
}

export async function runApplication() {
  Container.get(HttpService).initialize().start(3000)
  return Container.get(HttpService).server
}
