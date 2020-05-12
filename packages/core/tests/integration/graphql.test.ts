import { test, gql } from '../helper'
import GraphQLService from '../../src/services/GraphQLService'

test('graphql#health', async t => {
  GraphQLService.registerResolver('health', () => 'ok')

  GraphQLService.buildSchema(gql`
    type Query {
      health: String! @resolve
    }
  `)

  const res = await t.context.graphql<{ health: string }>({
    query: gql`
      query Health {
        health
      }
    `,
  })
  t.deepEqual(res.data.health, 'ok')
})
