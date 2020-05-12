require('reflect-metadata')

const PocketAce = require('./build')

PocketAce.registerResolver('hello', () => 'world')

PocketAce.configureDatabase({
  client: 'sqlite',
  connection: {
    filename: ':memory:',
  },
  useNullAsDefault: true,
})

PocketAce.buildSchema(`
  type Query {
    hello: String!
    users: [User!]! @all
  }

  type Mutation {
    createUser(name: String!): User @create
  }

  type User {
    id: ID!
    name: String!
  }
`)

PocketAce.initialize()

const sql = `
  create table users (
    id integer not null primary key autoincrement,
    name string not null default ''
  )
`

PocketAce.sql(sql).then(() => {
  PocketAce.runApplication()
})
