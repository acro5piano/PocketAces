import { test, gql } from '../helper'
import graphql from '../../src/services/GraphQLService'

// graphql.schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'RootQueryType',
//     fields: {
//       health: {
//         type: GraphQLString,
//         resolve() {
//           return 'ok'
//         },
//       },
//     },
//   }),
// })

test('graphql#health', async t => {
  graphql.buildSchema(gql`
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
