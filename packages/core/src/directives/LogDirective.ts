import { Container, Service, Inject } from 'typedi'
import { DatabaseService } from '../services/DatabaseService'
import { DirectiveContract } from '../contracts/DirectiveContract'

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

export default Container.get(LogDirective)
