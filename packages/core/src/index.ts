import { HttpService } from './services/HttpService'
import { GraphQLService } from './services/GraphQLService'
import { ConfigService } from './services/ConfigService'
import { DatabaseService } from './services/DatabaseService'
import { Container } from 'typedi'

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
