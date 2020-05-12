import { Service, Inject } from 'typedi'
import { DatabaseService } from '../services/DatabaseService'
import { DirectiveContract } from '../contracts/DirectiveContract'

@Service()
export class AllDirective implements DirectiveContract {
  @Inject()
  database!: DatabaseService

  name = 'all'

  resolveField() {
    return this.database.db.table('users')
  }
}
