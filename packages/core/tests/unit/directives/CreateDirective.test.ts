import 'tests/bootstrapServices'
import { test, gql, createTestDB } from 'tests/helper'
import { Schema } from 'src/schema/Schema'

test('@create', async (t) => {
  const schema = new Schema()

  await createTestDB()

  schema.buildSchema(gql`
    type Query {
      user(id: ID!): User @find(table: "users")
    }

    type Mutation {
      createUser(name: String!): User @create(table: "users")
      createPost(userId: ID!, title: String!): User @create(table: "posts")
    }

    type User {
      id: ID!
      name: String!
    }
  `)

  const inline = await schema.executeGraphQL({
    query: gql`
      mutation CreateUser {
        createUser(name: "Yuta") {
          id
          name
        }
      }
    `,
  })

  t.truthy(inline?.data?.createUser)

  return

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

  const createPost = await schema.executeGraphQL({
    query: gql`
      mutation CreatePost($userId: ID!) {
        createPost(userId: $userId, title: "Pocket Ace") {
          id
        }
      }
    `,
    variables: {
      userId: get?.data?.user?.id,
    },
  })
  t.truthy(createPost.data?.createPost?.id)
})
