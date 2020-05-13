import { BaseDirective } from './BaseDirective'
import { DirectiveExecutionChainable } from 'src/contracts/DirectiveContract'
import { omit } from 'src/utils'

export class ScopeDirective extends BaseDirective<{ table: string; [k: string]: any }, {}> {
  name = 'scope'

  resolveField({ currentValue }: DirectiveExecutionChainable) {
    return this.queryChain(currentValue)
      .table(this.getDirectiveArgValue('table') as string)
      .where(omit(this.getDirectiveArgs(), 'table'))
  }
}
