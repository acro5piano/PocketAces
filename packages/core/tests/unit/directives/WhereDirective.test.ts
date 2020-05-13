import 'tests/bootstrapServices'
import { test, gql, createTestDB } from 'tests/helper'
import { Schema } from 'src/schema/Schema'

test.beforeEach(async t => {
  await createTestDB()
  await t.context.db('users').insert({ name: 'Kazuya', isActive: false })
  await t.context.db('users').insert({ name: 'Yuta', isActive: false })
  await t.context.db('users').insert({ name: 'Ayana', isActive: false })
})

test('@where', async t => {
  const schema = new Schema()

  schema.buildSchema(gql`
    type Query {
      users(name: String): [User!]! @where(table: "users")
    }

    type User {
      id: ID!
      name: String!
    }
  `)

  const get = await schema.executeGraphQL({
    query: gql`
      query GetAllUsers {
        users(name: "Kazuya") {
          id
          name
        }
      }
    `,
  })
  t.is(1, get.data?.users?.length)
  t.is('Kazuya', get.data?.users?.[0]?.name)
})

test('@where pipes @find', async t => {
  const schema = new Schema()
  const [{ id }] = await t.context
    .db('users')
    .select('id')
    .where({ name: 'Kazuya', isActive: false })

  schema.buildSchema(gql`
    type Query {
      userOf(id: ID!, name: String, isActive: Boolean): User
        @where(table: "users", keys: ["name", "isActive"])
        @find(table: "users")
    }

    type User {
      id: ID!
      name: String!
    }
  `)

  const get = await schema.executeGraphQL({
    query: gql`
      query GetAllUsers($id: ID!) {
        userOf(id: $id, isActive: true) {
          id
          name
        }
      }
    `,
    variables: {
      id,
    },
  })
  t.is(null, get.data?.userOf)
})
