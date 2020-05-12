import { Service, Inject } from 'typedi'
import { DatabaseService } from 'src/services/DatabaseService'
import { DirectiveContract } from 'src/contracts/DirectiveContract'

@Service()
export class WhereDirective implements DirectiveContract {
  @Inject()
  database!: DatabaseService

  name = 'where'

  resolveField() {
    return this.database.db.table('users')
  }
}
