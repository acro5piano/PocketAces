import 'tests/bootstrapServices'
import { test, gql, createTestDB } from 'tests/helper'
import { Schema } from 'src/schema/Schema'

test.beforeEach(async t => {
  await createTestDB()

  const [userId] = await t.context
    .db('users')
    .insert({ name: 'Kazuya' })
    .returning('id')
  await t.context.db('posts').insert({ userId, title: 'Pocket Ace' })
  await t.context.db('posts').insert({ userId, title: 'Pocket Ace' })
  await t.context.db('posts').insert({ userId, title: 'Pocket Ace' })

  // Other user to see N+1 problem does not happen!
  await t.context.db('users').insert({ name: 'Yuta' }).returning('id')
  await t.context.db('users').insert({ name: 'Maria' }).returning('id')
  await t.context.db('users').insert({ name: 'John' }).returning('id')
})

test('@hasMany with directiveArgs', async t => {
  const schema = new Schema()
  const [{ id }] = await t.context.db('users').where({ name: 'Kazuya' })

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
  t.is(id.toString(), get.data?.users?.[0]?.id)
  t.is(3, get.data?.users?.[0]?.posts.length)
  t.is(0, get.data?.users?.[1]?.posts.length)
})

test('@hasMany without directiveArgs', async t => {
  const schema = new Schema()
  const [{ id }] = await t.context.db('users').where({ name: 'Kazuya' })

  schema.buildSchema(gql`
    type Query {
      users: [User!]! @all
    }

    type User {
      id: ID!
      name: String!
      posts: [Post!]! @hasMany
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
  t.is(id.toString(), get.data?.users?.[0]?.id)
  t.is(3, get.data?.users?.[0]?.posts.length)
  t.is(0, get.data?.users?.[1]?.posts.length)
})
