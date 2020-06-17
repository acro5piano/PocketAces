const { PocketAces } = require('./build')

const app = new PocketAces()

function myDirective({ currentValue }) {
  console.log('Hello! You created your first directive :)')
  return currentValue
}

app.registerResolver('hello', () => 'world')
app.registerDirective(myDirective)

app.configureDatabase({
  client: 'sqlite',
  connection: {
    filename: ':memory:',
  },
  useNullAsDefault: true,
})

app.buildSchema(`
  type Query {
    hello: String! @myDirective
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
