![test](https://github.com/acro5piano/PocketAce/workflows/test/badge.svg)
[![npm version](https://badge.fury.io/js/%40pocket-ace%2Fcore.svg)](https://badge.fury.io/js/%40pocket-ace%2Fcore)

# PocketAce

An Experimental GrpahQL framework

# Features to build

The following features **will** be implemented:

- **GraphQL First**: Built for making GraphQL server without hassle
- **High Performance**: Efficient data loading by default
- **Opinionated**: No worry about directory structure, library, testing
- **Realtime**: Built-in subscriptions, live queries
- **Ergonomic**: Less code, great DX
- **Free DB choice**: Can support major databases (PG, MySQL, and so on)
- **Type Safe**: 100% Written in TypeScript (or Deno)

# Getting Started

Install it:

```
yarn add @pocket-ace/core
```

Define your app:

```javascript
require('reflect-metadata')

const PocketAce = require('./build')

PocketAce.registerResolver('hello', () => 'world')

PocketAce.configureDatabase({
  client: 'sqlite',
  connection: {
    filename: ':memory:',
  },
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
```

I know the above code is ugly. We'll improve it soon.

# Directory structure for the Framework

```
.
|-- cmd              # CLI command
|  |-- SomeTask.ts
|  `-- index.ts
|-- config           # App configuration
|-- jobs             # Async jobs
|-- middlewares      # HTTP Middlewares
|-- policies         # Policies
|-- resolvers        # Custom resolvers
|-- schema           # GraphQL Schema (every file in this dir loaded)
|  `-- index.gql
`-- tests            # Tests
   |-- feature
   | `-- LoginUserTest.ts #
   `-- unit #
     `-- LoginUserTest.ts #
```
