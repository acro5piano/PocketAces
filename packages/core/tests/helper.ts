import request from 'supertest'
import anyTest, { TestInterface } from 'ava'

export const test = anyTest.serial as TestInterface<{
  server: any
  graphql: ReturnType<typeof makeGraphql>
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
