import { test, gql } from '../helper'
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'
import graphql from '../../src/services/GraphQLService'

const schema = gql`
  type Query {
    health: String!
  }
`

test('graphql#health', async t => {
  graphql.schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
        health: {
          type: GraphQLString,
          resolve() {
            return 'ok'
          },
        },
      },
    }),
  })

  const res = await t.context.graphql<{ health: string }>({
    query: gql`
      query Health {
        health
      }
    `,
  })
  t.deepEqual(res.data.health, 'ok')
})
