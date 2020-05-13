import 'tests/bootstrapServices'
import { test, gql, createTestDB } from 'tests/helper'
import { Schema } from 'src/schema/Schema'

test('@create', async t => {
  const schema = new Schema()

  await createTestDB()

  const [userId] = await t.context.db('users').insert({ name: 'Kazuya' }).returning('id')
  await t.context.db('posts').insert({ userId, title: 'Pocket Ace' })
  await t.context.db('posts').insert({ userId, title: 'Pocket Ace' })
  await t.context.db('posts').insert({ userId, title: 'Pocket Ace' })

  // Other user to see N+1 problem
  await t.context.db('users').insert({ name: 'Yuta' }).returning('id')
  await t.context.db('users').insert({ name: 'Maria' }).returning('id')
  await t.context.db('users').insert({ name: 'John' }).returning('id')

  schema.buildSchema(gql`
    type Query {
      users: [User!]! @all(table: "users")
    }

    type User {
      id: ID!
      name: String!
      posts: [Post!]! @hasMany(table: "posts", joins: "userId")
    }

    type Post {
      id: ID!
      title: String!
    }
  `)

  const get = await schema.executeGraphQL({
    query: gql`
      query GetAllUsers {
        users {
          id
          name
          posts {
            id
            title
          }
        }
      }
    `,
  })
  t.is(userId.toString(), get.data?.users?.[0]?.id)
  t.is(3, get.data?.users?.[0]?.posts.length)
  t.is(0, get.data?.users?.[1]?.posts.length)
})
