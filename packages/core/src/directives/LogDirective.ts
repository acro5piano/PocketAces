import { Service, Inject } from 'typedi'
import { DatabaseService } from 'src/services/DatabaseService'
import { DirectiveContract } from 'src/contracts/DirectiveContract'

@Service()
export class LogDirective implements DirectiveContract {
  @Inject()
  database!: DatabaseService

  name = 'log'

  resolveField({ currentValue }: any) {
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
    return currentValue
  }
}
