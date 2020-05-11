import { test, makeGraphql } from './helper'
import { createServer } from '../src/server'

test.beforeEach(t => {
  t.context.server = createServer().listen()
  t.context.graphql = makeGraphql(t.context.server)
})
