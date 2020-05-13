import request from 'supertest'
import anyTest, { TestInterface } from 'ava'
import { DatabaseService } from 'src/services/DatabaseService'
import { Container } from 'typedi'
import Knex from 'knex'

export const test = anyTest.serial as TestInterface<{
  server: any
  graphql: ReturnType<typeof makeGraphql>
  db: Knex
}>

export const gql = (literal: TemplateStringsArray) => literal[0]

export function normGql(query: string) {
  return query
    .replace(/\n/g, '')
    .replace(/ +/g, ' ')
    .replace(/^ /, '')
    .replace(/ $/, '')
    .replace(/ ?({|}|:|,) ?/g, '$1')
    .replace(/\.\.\. /g, '...')
}

interface GraphqlArgument<V> {
  query: string
  variables?: V
  authorization?: string
}

export type GraphQLResponse<T> = {
  data: T
}

export function makeGraphql(app: any) {
  return async function graphql<T = any, V = any>({
    query,
    variables = undefined,
    authorization = '',
  }: GraphqlArgument<V>): Promise<GraphQLResponse<T>> {
    const res = await request(app)
      .post('/graphql')
      .send({
        query,
        variables,
      })
      .set('Authorization', authorization)
    return res.body
  }
}

export async function createTestDB() {
  await Container.get(DatabaseService).db.raw(`
    create table users (
      id integer not null primary key autoincrement,
      name string not null default '',
      email string not null default '',
      password_hash string,
      is_active boolean not null default false
    )
  `)
  await Container.get(DatabaseService).db.raw(`
    create table posts (
      id integer not null primary key autoincrement,
      user_id integer not null,
      title string not null default '',
      foreign key("user_id") references "users"("id") on delete cascade
    )
  `)
}
