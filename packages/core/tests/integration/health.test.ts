import request from 'supertest'
import { test } from '../helper'

test('health', async t => {
  t.truthy(t.context.server)
  const res = await request(t.context.server).get('/').send().expect(200)
  t.deepEqual(res.body, { status: 'ok' })
})
