Container.get(ConfigService).database = {
  client: 'sqlite',
  connection: {
    filename: ':memory:',
  },
  useNullAsDefault: true,
}
Container.get(DatabaseService).init()
Container.get(HttpService).initialize()
t.context.server = Container.get(HttpService).server
t.context.graphql = makeGraphql(t.context.server.listen())
