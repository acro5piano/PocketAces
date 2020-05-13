import { BaseDirective } from './BaseDirective'
import { pick } from 'src/utils'
import { DirectiveExecutionChainable } from 'src/contracts/DirectiveContract'

export class WhereDirective extends BaseDirective<{ table: string; keys?: string[] }, {}> {
  name = 'where'

  resolveField({ currentValue }: DirectiveExecutionChainable) {
    const keys = this.getDirectiveArgValue('keys') || ([] as string[])
    const where =
      keys.length > 0 ? pick(this.getInputArgs() as any, ...keys) : (this.getInputArgs() as string)

    return this.queryChain(currentValue)
      .table(this.getDirectiveArgValue('table') as string)
      .where(where)
  }
}
