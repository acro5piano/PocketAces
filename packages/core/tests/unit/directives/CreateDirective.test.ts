import 'tests/bootstrapServices'
import { test, gql } from 'tests/helper'
import { Schema } from 'src/schema/Schema'
import { DatabaseService } from 'src/services/DatabaseService'
import { Container } from 'typedi'

test('@create', async t => {
  const schema = new Schema()

  await Container.get(DatabaseService).db.raw(`
    create table users (
      id integer not null primary key autoincrement,
      name string not null default ''
    )
  `)

  schema.buildSchema(gql`
    type Query {
      user(id: ID!): User @find
    }

    type Mutation {
      createUser(name: String!): User @create
      hello(name: String!): User! @create
    }

    type User {
      id: ID!
      name: String!
    }
  `)

  await schema.executeGraphQL({
    query: gql`
      mutation CreateUser {
        createUser(name: "Yuta") {
          id
          name
        }
      }
    `,
  })

  const create = await schema.executeGraphQL({
    query: gql`
      mutation CreateUser($name: String!) {
        createUser(name: $name) {
          id
          name
        }
      }
    `,
    variables: {
      name: 'Kazuya',
    },
  })
  t.truthy(create.data?.createUser?.id)

  const get = await schema.executeGraphQL({
    query: gql`
      query GetUser($id: ID!) {
        user(id: $id) {
          id
          name
        }
      }
    `,
    variables: {
      id: create.data?.createUser?.id,
    },
  })

  t.is(create.data?.createUser?.id, get?.data?.user?.id)
})
