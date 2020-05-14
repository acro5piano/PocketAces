import 'tests/bootstrapServices'
import { test, gql, createTestDB } from 'tests/helper'
import { Schema } from 'src/schema/Schema'

test.beforeEach(async (t) => {
  await createTestDB()

  await t.context.db('users').insert({ name: 'Kazuya' })
  await t.context.db('users').insert({ name: 'Nick' })
})

test('@can - success', async (t) => {
  const schema = new Schema()

  const [user] = await t.context.db('users').where({ name: 'Kazuya' })

  schema.buildSchema(gql`
    type Mutation {
      updateProfile(id: ID!, name: String!): User
        @find
        @can(eq: "users.id")
        @update(keys: ["name"])
    }

    type User {
      id: ID!
      name: String!
    }
  `)

  const { data } = await schema.executeGraphQL({
    query: gql`
      mutation UpdateProfile($id: ID!) {
        updateProfile(id: $id, name: "Tom") {
          id
          name
        }
      }
    `,
    variables: {
      id: user.id.toString(),
    },
    context: {
      user: {
        uid: user.id.toString(),
      },
    },
  })

  t.is('Tom', data?.updateProfile?.name)
  t.is(1, 1)
})
