import 'tests/bootstrapServices'
import { test, gql, createTestDB } from 'tests/helper'
import { Schema } from 'src/schema/Schema'

test.beforeEach(async t => {
  await createTestDB()

  const passwordHash =
    '$2b$10$X268/ci4lEFDGbjlf5urIuStna7Mfe0jYs8Wldqtks.7TAp7IfiQC' // password

  await t.context
    .db('users')
    .insert({ email: 'ketsume0211@gmail.com', name: 'Kazuya', passwordHash })
    .returning('id')
})

test('@login - success', async t => {
  const schema = new Schema()

  schema.buildSchema(gql`
    type Mutation {
      login(email: String!, password: String!): LoginPayload
        @login(
          table: "users"
          role: "User"
          identify: "email"
          password: "password"
          hashedColumn: "passwordHash"
        )
    }

    type LoginPayload {
      token: String!
      refreshToken: String!
    }

    type User {
      id: ID!
      name: String!
      email: String!
    }
  `)

  const get = await schema.executeGraphQL({
    query: gql`
      mutation Login {
        login(email: "ketsume0211@gmail.com", password: "password") {
          token
          refreshToken
        }
      }
    `,
  })
  t.truthy(get.data?.login?.token)
  t.truthy(get.data?.login?.refreshToken)
})

test('@login - failed', async t => {
  const schema = new Schema()

  schema.buildSchema(gql`
    type Mutation {
      login(email: String!, password: String!): LoginPayload
        @login(
          table: "users"
          role: "User"
          identify: "email"
          password: "password"
          hashedColumn: "passwordHash"
        )
    }

    type LoginPayload {
      token: String!
      refreshToken: String!
    }

    type User {
      id: ID!
      name: String!
      email: String!
    }
  `)

  const get = await schema.executeGraphQL({
    query: gql`
      mutation Login {
        login(email: "ketsume0211@gmail.com", password: "wrong_password") {
          token
          refreshToken
        }
      }
    `,
  })
  t.is('User not found, or password is invalid.', get.errors?.[0]?.message)
})
