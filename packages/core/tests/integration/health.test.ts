import 'tests/bootstrapServices'
import request from 'supertest'
import { test } from 'tests/helper'

test('health', async t => {
  t.truthy(t.context.server)
  const res = await request(t.context.server.listen()).get('/').send().expect(200)
  t.deepEqual(res.body, { status: 'ok' })
})
