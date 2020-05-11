import request from 'supertest'
import anyTest, { TestInterface } from 'ava'
import { Server } from 'http'

export const test = anyTest.serial as TestInterface<{
  server: Server
  graphql: ReturnType<typeof makeGraphql>
}>

export const gql = (literal: TemplateStringsArray) => literal[0]

interface GraphqlArgument<V> {
  query: string
  variables?: V
  authorization?: string
}

export type GraphQLResponse<T> = {
  data: T
}

export function makeGraphql(app: Server) {
  return async function graphql<T, V = any>({
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
    console.log(JSON.stringify(res.body, undefined, 2))
    return res.body
  }
}
