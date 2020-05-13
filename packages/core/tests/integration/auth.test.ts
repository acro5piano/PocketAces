import 'tests/bootstrapServices'
import { test, gql, createTestDB } from 'tests/helper'
import { Container } from 'typedi'
import { GraphQLService } from 'src/services/GraphQLService'
import * as Auth from 'src/auth/Auth'

test('graphql#auth', async t => {
  await createTestDB()
  const [id] = await t.context
    .db('users')
    .insert({ name: 'Kazuya' })
    .returning('id')

  Container.get(GraphQLService).buildSchema(gql`
    type Query {
      currentUser: User @auth
    }

    type User {
      id: ID!
      name: String!
      email: String!
    }
  `)

  const denied = await t.context.graphql({
    query: gql`
      query GetMe {
        currentUser {
          id
          name
        }
      }
    `,
  })
  t.is(undefined, denied.data?.currentUser?.id)
  t.is('Not Authorized.', denied.errors?.[0]?.message)

  const accepted = await t.context.graphql({
    query: gql`
      query GetMe {
        currentUser {
          id
          name
        }
      }
    `,
    authorization: Auth.createToken(id, 'User'),
  })
  t.is(id.toString(), accepted.data?.currentUser?.id)
})
