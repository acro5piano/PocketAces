import { BaseDirective } from './BaseDirective'

export class LogDirective extends BaseDirective {
  name = 'log'

  resolveField({ currentValue }: any) {
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
    return currentValue
  }
}
