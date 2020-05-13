import { BaseDirective } from './BaseDirective'
import { DirectiveContract } from 'src/contracts/DirectiveContract'

export class LogDirective extends BaseDirective implements DirectiveContract {
  name = 'log'

  resolveField({ currentValue }: any) {
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
    return currentValue
  }
}
