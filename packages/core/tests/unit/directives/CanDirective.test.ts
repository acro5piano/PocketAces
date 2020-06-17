import 'tests/bootstrapServices'
import { Container } from 'typedi'
import { test, gql, createTestDB } from 'tests/helper'
import { Schema } from 'src/schema/Schema'

test.beforeEach(async (t) => {
  await createTestDB()

  await t.context.db('users').insert({ name: 'Kazuya' })
  await t.context.db('users').insert({ name: 'Nick' })
})

test.only('@can - success', async (t) => {
  const schema = Container.get(Schema)

  const [user] = await t.context.db('users').where({ name: 'Kazuya' })

  schema.buildSchema(gql`
    type Query {
      users: [User!]! @can(roles: ["ADMIN"]) @all
    }

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

  const users = await schema.executeGraphQL({
    query: gql`
      query GetUsers {
        users {
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
        role: 'ADMIN',
      },
    },
  })

  t.is(users.data?.users?.length, 2)

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
})

test('@can - failed', async (t) => {
  const schema = Container.get(Schema)

  const [kazuya] = await t.context.db('users').where({ name: 'Kazuya' })
  const [nickId] = await t.context
    .db('users')
    .insert({ name: 'Nick' })
    .returning('id')

  schema.buildSchema(gql`
    type Query {
      users: [User] @can(roles: ["ADMIN"]) @all
      user(id: ID!): User @can(eq: "users.id") @find
    }

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

  const getNickFromKazuya = {
    variables: {
      id: nickId.toString(),
    },
    context: {
      user: {
        uid: kazuya.id.toString(),
        roles: ['GENERAL'],
      },
    },
  }

  const adminQuery = await schema.executeGraphQL({
    query: gql`
      query GetUsers {
        users {
          id
        }
      }
    `,
    ...getNickFromKazuya,
  })

  t.falsy(adminQuery?.data?.users?.[0]?.id)
  t.is(
    'Not authorized to access this resource.',
    adminQuery?.errors?.[0]?.message,
  )

  const nickQuery = await schema.executeGraphQL({
    query: gql`
      query GetUser($id: ID!) {
        user(id: $id) {
          id
        }
      }
    `,
    ...getNickFromKazuya,
  })

  t.falsy(nickQuery?.data?.user?.id)

  // TODO: since directive resolveField cannot return promise as for Knex resolve,
  //       we cannot return the correct error message here like this.
  //       To resolve this issue, we have to read current query context
  //       and @can is applied or not to detect authorization errors or any other errors arised.
  // t.is(
  //   'Not authorized to access this resource.',
  //   nickQuery?.errors?.[0]?.message,
  // )

  const nickMutation = await schema.executeGraphQL({
    query: gql`
      mutation UpdateProfile($id: ID!) {
        updateProfile(id: $id, name: "Tom") {
          id
          name
        }
      }
    `,
    ...getNickFromKazuya,
  })

  t.falsy(nickMutation?.data?.updateProfile?.name)
})
