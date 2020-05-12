import { test, makeGraphql } from './helper'
import HttpService from '../src/services/HttpService'
import ConfigService from '../src/services/ConfigService'
import DatabaseService from '../src/services/DatabaseService'

test.beforeEach(t => {
  ConfigService.database = {
    client: 'sqlite',
    connection: {
      filename: ':memory:',
    },
    useNullAsDefault: true,
  }
  DatabaseService.init()
  HttpService.initialize()
  t.context.server = HttpService.server
  t.context.graphql = makeGraphql(t.context.server.listen())
})
