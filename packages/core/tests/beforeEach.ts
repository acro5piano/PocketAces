import { test, makeGraphql } from './helper'
import http from '../src/services/HttpService'

test.beforeEach(t => {
  http.initialize()
  t.context.server = http.server
  t.context.graphql = makeGraphql(t.context.server.listen())
})
