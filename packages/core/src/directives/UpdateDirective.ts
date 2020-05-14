import { BaseDirective } from './BaseDirective'
import { pick } from 'src/utils'
import { DirectiveExecutionArgs } from 'src/contracts/DirectiveContract'

export class UpdateDirective extends BaseDirective<
  {
    table?: string
    keys?: string
  },
  any
> {
  name = 'update'

  async resolveField({ currentValue }: DirectiveExecutionArgs) {
    const keys = this.getDirectiveArgValue('keys') || ([] as string[])

    await this.queryChain(currentValue)
      .clone()
      .update(pick(this.getInputArgs() as any, ...keys))

    return this.queryChain(currentValue)
  }
}
