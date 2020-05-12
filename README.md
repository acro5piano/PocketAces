![test](https://github.com/acro5piano/PocketAce/workflows/test/badge.svg)

# PocketAce

An Experimental GrpahQL framework

# Features to build

- **GraphQL First**: Built for making GraphQL server without hassle
- **High Performance**: Efficient data loading by default
- **Opinionated**: No worry about directory structure, library, testing
- **Realtime**: Built-in subscriptions, live queries
- **Ergonomic**: Less code, great DX
- **Free DB choice**: Can support major databases (PG, MySQL, and so on)
- **Type Safe**: 100% Written in TypeScript (or Deno)

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
