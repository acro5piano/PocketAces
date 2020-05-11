import { test, gql } from '../helper'
import { parseSchema } from '../../src/parser'

test('parser#parseSchema', async t => {
  const res = await parseSchema(gql`
    type Query {
      health: String! @resolve
    }
  `)
  t.truthy(res)

  console.log(JSON.stringify(res, undefined, 2))
})
