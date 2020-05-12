import { test } from '../../helper'
import DatabaseService from '../../../src/services/DatabaseService'

test('@create', async t => {
  await DatabaseService.db.raw(`
    create table users (
      id integer not null primary key autoincrement,
      name string not null default ''
    )
  `)
  await DatabaseService.db.table('users').insert({
    name: 'kazuya',
  })
  const res = await DatabaseService.db
    .table('users')
    .where({
      name: 'kazuya',
    })
    .first()

  t.is(res.name, 'kazuya')
})
