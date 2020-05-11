import knex from 'knex'
import { Container, Service } from 'typedi'
import config from './ConfigService'

const knexStringcase = require('knex-stringcase')
const knexTinyLogger = require('knex-tiny-logger').default

@Service()
export class DatabaseService {
  db!: knex

  init() {
    const db = knex(knexStringcase(config.database))
    knexTinyLogger(db)
    this.db = db
  }
}

export default Container.get(DatabaseService)
