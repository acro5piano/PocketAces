import { Service, Inject } from 'typedi'
import { DatabaseService } from '../services/DatabaseService'
import { DirectiveContract } from '../contracts/DirectiveContract'

@Service()
export class WhereDirective implements DirectiveContract {
  @Inject()
  database!: DatabaseService

  name = 'where'

  resolveField() {
    return this.database.db.table('users')
  }
}
