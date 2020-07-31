![test](https://github.com/acro5piano/PocketAces/workflows/test/badge.svg)
![publish](https://github.com/acro5piano/PocketAces/workflows/publish/badge.svg)
[![npm version](https://badge.fury.io/js/%40pocket-aces%2Fcore.svg)](https://badge.fury.io/js/%40pocket-aces%2Fcore)
[![codecov](https://codecov.io/gh/acro5piano/PocketAces/branch/master/graph/badge.svg)](https://codecov.io/gh/acro5piano/PocketAces)

# PocketAces

An Experimental GrpahQL framework

Note: under heavy development. Do not use in production.

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

Install:

```
yarn add @pocket-aces/core graphql sqlite3
```

Define your app:

```javascript
// app.js

const { PocketAces } = require('@pocket-aces/core')

const app = new PocketAces()

app.registerResolver('hello', () => 'world')
app.configureDatabase({
  client: 'sqlite',
  connection: {
    filename: ':memory:',
  },
})
app.buildSchema(`
  type Query {
    hello: String!
    users: [User!]! @all(table: "users")
  }

  type Mutation {
    createUser(name: String!): User @create(table: "users")
  }

  type User {
    id: ID!
    name: String!
  }
`)
app.initialize()

const sql = `
  create table users (
    id integer not null primary key autoincrement,
    name string not null default ''
  )
`

app.sql(sql).then(() => {
  app.runApplication()
})
```

I know the above code is ugly. We'll improve it soon.

Then run `node app.js`.

You can now run GraphQL queries to http://localhost:3000

```bash
curl -XPOST localhost:3000/graphql -d query='{ hello }'
```

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

# Built with

Main dependencies:

- Koa
- GraphQL
- Knex
- TypeDI
- Dataloader

Development:

- TypeScript, ts-node
- Ava
- Supertest
- SQLite
- Lerna
- Rollup

Heavily inspired by https://github.com/nuwave/lighthouse
