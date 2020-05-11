import { test } from './helper'
import { createServer } from '../src/server'

test.beforeEach(t => {
  t.context.server = createServer().listen()
})
