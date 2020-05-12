import 'tests/bootstrapServices'
import { test, gql } from 'tests/helper'
import { Container } from 'typedi'
import { GraphQLService } from 'src/services/GraphQLService'

test('graphql#health', async t => {
  Container.get(GraphQLService).registerResolver('health', () => 'ok')

  Container.get(GraphQLService).buildSchema(gql`
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
