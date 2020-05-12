import { test, gql, normGql } from '../helper'
import { Schema } from '../../src/schema/Schema'

test('schema#executeGraphQL', async t => {
  const schema = new Schema()

  await schema.buildSchema(gql`
    type Query {
      health: String! @resolve
    }

    type Mutation {
      createUser(input: UserInput!): User! @create
    }

    type User {
      id: ID!
      name: String!
      posts: [Post!]!
    }

    type Post {
      id: ID!
      title: String!
    }

    input UserInput {
      name: String!
    }
  `)

  schema.executeGraphQL({
    query: gql`
      query Health {
        health
      }
    `,
  })

  t.is(
    normGql(schema.toString()),
    normGql(gql`
      type Query {
        health: String!
      }
    `),
  )
})
