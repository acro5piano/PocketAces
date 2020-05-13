import { Container } from 'typedi'
import { test, makeGraphql } from 'tests/helper'
import { HttpService } from 'src/services/HttpService'
import { ConfigService } from 'src/services/ConfigService'
import { DatabaseService } from 'src/services/DatabaseService'
import { ReloationLoader } from 'src/database/ReloationLoader'

test.beforeEach(t => {
  Container.get(ConfigService).database = {
    client: 'sqlite',
    connection: {
      filename: ':memory:',
    },
    useNullAsDefault: true,
  }
  Container.get(DatabaseService).initialize()
  Container.get(HttpService).initialize()
  t.context.server = Container.get(HttpService).server
  t.context.graphql = makeGraphql(t.context.server.listen())
  t.context.db = Container.get(DatabaseService).db
})

test.afterEach(() => {
  Container.get(ReloationLoader).clear()
})
