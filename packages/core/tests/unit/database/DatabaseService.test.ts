import 'tests/bootstrapServices'
import { test } from 'tests/helper'
import { Container } from 'typedi'
import { DatabaseService } from 'src/services/DatabaseService'

test('@create', async t => {
  const db = Container.get(DatabaseService).db

  await db.raw(`
    create table users (
      id integer not null primary key autoincrement,
      name string not null default ''
    )
  `)
  await db.table('users').insert({
    name: 'kazuya',
  })
  const res = await db
    .table('users')
    .where({
      name: 'kazuya',
    })
    .first()

  t.is(res.name, 'kazuya')
})
