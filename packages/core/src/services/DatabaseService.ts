import knex from 'knex'
import { Service, Inject } from 'typedi'
import { ConfigService } from './ConfigService'

const knexStringcase = require('knex-stringcase')
const knexTinyLogger = require('knex-tiny-logger').default

@Service()
export class DatabaseService {
  db!: knex

  @Inject()
  config!: ConfigService

  initialize() {
    const db = knex(knexStringcase(this.config.database))
    knexTinyLogger(db)
    this.db = db
  }
}
