import 'tests/bootstrapServices'
import { test, gql, createTestDB } from 'tests/helper'
import { Schema } from 'src/schema/Schema'

test.beforeEach(async t => {
  await createTestDB()
  await t.context.db('users').insert({ name: 'Kazuya', isActive: false })
  await t.context.db('users').insert({ name: 'Yuta', isActive: false })
  await t.context.db('users').insert({ name: 'Ayana', isActive: true })
})

test('@scope', async t => {
  const schema = new Schema()

  schema.buildSchema(gql`
    type Query {
      activeUsers: [User!]! @scope(table: "users", isActive: true)
    }

    type User {
      id: ID!
      name: String!
    }
  `)

  const get = await schema.executeGraphQL({
    query: gql`
      query GetActiveUsers {
        activeUsers {
          id
          name
        }
      }
    `,
  })

  t.is(1, get.data?.activeUsers?.length)
  t.is('Ayana', get.data?.activeUsers?.[0]?.name)
})
