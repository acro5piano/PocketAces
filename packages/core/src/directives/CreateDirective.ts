import { Service, Inject } from 'typedi'
import { DatabaseService } from 'src/services/DatabaseService'
import { DirectiveContract } from 'src/contracts/DirectiveContract'

@Service()
export class CreateDirective implements DirectiveContract {
  @Inject()
  database!: DatabaseService

  name = 'create'

  async resolveField({ operationArgs }: any) {
    const [id] = await this.database.db('users').insert(operationArgs).returning('id')
    const user = await this.database.db('users').where({ id }).first()
    return user
  }
}
