import { test, gql, normGql } from 'tests/helper'
import { Container } from 'typedi'
import { Schema } from 'src/schema/Schema'
import { DatabaseService } from 'src/services/DatabaseService'

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

test('schema#executeGraphQL', async (t) => {
  Container.set(DatabaseService, mockedDatabaseService)
  const schema = Container.get(Schema)

  schema.registerResolver('health', () => 'ok')
  schema.registerResolver('mockUsers', () => mockUsers)
  schema.registerResolver('createUser', () => 'hello')

  schema.buildSchema(gql`
    type Query {
      health: String!
      mockUsers: [User!]!
      users: [User!]! @all @log
      user(id: ID!): User! @find
    }

    type Mutation {
      createUser(role: String!, input: UserInput!): User! @create
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
