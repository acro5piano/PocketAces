import { Service, Inject } from 'typedi'
import { DatabaseService } from 'src/services/DatabaseService'
import { DirectiveContract } from 'src/contracts/DirectiveContract'

@Service()
export class AllDirective implements DirectiveContract {
  @Inject()
  database!: DatabaseService

  name = 'all'

  resolveField() {
    return this.database.db.table('users')
  }
}
