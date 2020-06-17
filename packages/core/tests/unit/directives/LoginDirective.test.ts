import 'tests/bootstrapServices'
import { test, gql, createTestDB } from 'tests/helper'
import { Schema } from 'src/schema/Schema'
import { Container } from 'typedi'
import { getUserFromToken } from 'src/auth/Auth'

test.beforeEach(async (t) => {
  await createTestDB()

  const passwordHash =
    '$2b$10$X268/ci4lEFDGbjlf5urIuStna7Mfe0jYs8Wldqtks.7TAp7IfiQC' // password

  await t.context
    .db('users')
    .insert({ email: 'ketsume0211@gmail.com', name: 'Kazuya', passwordHash })
    .returning('id')
})

test('@login - success', async (t) => {
  const schema = Container.get(Schema)

  const user = await t.context.db('users').first()

  schema.buildSchema(gql`
    type Mutation {
      login(email: String!, password: String!): LoginPayload
        @login(
          table: "users"
          role: "User"
          identity: "email"
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

  const iat = Math.floor(Date.now() / 1000) // TODO: not consistent
  const loginUser = getUserFromToken(get.data?.login?.token)
  const refreshUser = getUserFromToken(get.data?.login?.refreshToken)

  t.is(user?.id.toString(), loginUser.uid)
  t.is('User', loginUser.role)
  t.is(iat, loginUser.iat)
  t.is('login', loginUser.type)

  t.is(user?.id.toString(), refreshUser.uid)
  t.is('User', refreshUser.role)
  t.is(iat, refreshUser.iat)
  t.is('refresh', refreshUser.type)
})

test('@login - failed', async (t) => {
  const schema = Container.get(Schema)

  schema.buildSchema(gql`
    type Mutation {
      login(email: String!, password: String!): LoginPayload
        @login(
          table: "users"
          role: "User"
          identity: "email"
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
