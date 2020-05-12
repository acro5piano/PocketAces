import { Container, Service, Inject } from 'typedi'
import { DatabaseService } from '../services/DatabaseService'
import { DirectiveContract } from '../contracts/DirectiveContract'

@Service()
export class FindDirective implements DirectiveContract {
  @Inject()
  database!: DatabaseService

  name = 'find'

  resolveField({ operationArgs }: any) {
    return this.database.db.table('users').where({ id: operationArgs.id }).first()
  }
}

export default Container.get(FindDirective)
