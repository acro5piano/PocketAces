import { test, gql, normGql } from '../helper'
import { Schema } from '../../src/schema/Schema'
import AllDirective from '../../src/directives/AllDirective'
import WhereDirective from '../../src/directives/WhereDirective'

const mockUsers = [
  {
    id: '1',
    name: 'Kazuya',
    posts: [
      {
        id: 'N',
        title: 'About',
      },
    ],
  },
]

const mockedTable = () => mockUsers
mockedTable.first = mockUsers[0]

const mockedDatabaseService = {
  db: {
    table: mockedTable,
  },
}

// TODO: failing Container.set in typedi so mock DB in this way
Object.assign(AllDirective, { database: mockedDatabaseService })
Object.assign(WhereDirective, { database: mockedDatabaseService })

test('schema#executeGraphQL', async t => {
  const schema = new Schema()

  schema.registerResolver('health', () => 'ok')
  schema.registerResolver('mockUsers', () => mockUsers)
  schema.registerResolver('createUser', () => 'hello')

  schema.buildSchema(gql`
    type Query {
      health: String!
      mockUsers: [User!]!
      users: [User!]! @all @log
      user(id: ID!): User! @find
      activeUsers: [User!]! @where(isActive: true)
    }

    type Mutation {
      createUser(role: String!, input: UserInput!): User! @create
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

    input UserInput {
      name: String!
    }
  `)

  let res = await schema.executeGraphQL<any>({
    query: gql`
      query Health {
        health
      }
    `,
  })
  t.is(res.data?.health, 'ok')

  res = await schema.executeGraphQL<any>({
    query: gql`
      query GetMockUsers {
        mockUsers {
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
  t.deepEqual(res.data?.mockUsers, mockUsers)

  res = await schema.executeGraphQL<any>({
    query: gql`
      query GetActiveUsers {
        activeUsers {
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
  t.deepEqual(res.data?.activeUsers, mockUsers)

  res = await schema.executeGraphQL<any>({
    query: gql`
      query GetUsers {
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
  t.deepEqual(res.data?.users, mockUsers)

  t.is(
    normGql(schema.toString()),
    normGql(gql`
      type Query {
        health: String!
        mockUsers: [User!]!
        users: [User!]!
        user(id: ID!): User!
        activeUsers: [User!]!
      }

      type User {
        id: ID!
        name: String!
        posts: [Post!]!
      }

      type Post {
        id: ID!
        title: String!
      }

      type Mutation {
        createUser(role: String!, input: UserInput!): User!
      }

      input UserInput {
        name: String!
      }
    `),
  )
})
