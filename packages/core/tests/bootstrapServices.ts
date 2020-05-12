import { Container } from 'typedi'
import { test, makeGraphql } from 'tests/helper'
import { HttpService } from 'src/services/HttpService'
import { ConfigService } from 'src/services/ConfigService'
import { DatabaseService } from 'src/services/DatabaseService'

test.beforeEach(t => {
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
})
