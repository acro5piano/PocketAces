import { Service, Inject } from 'typedi'
import { DatabaseService } from 'src/services/DatabaseService'
import { DirectiveContract } from 'src/contracts/DirectiveContract'

@Service()
export class FindDirective implements DirectiveContract {
  @Inject()
  database!: DatabaseService

  name = 'find'

  resolveField({ operationArgs }: any) {
    return this.database.db.table('users').where({ id: operationArgs.id }).first()
  }
}
