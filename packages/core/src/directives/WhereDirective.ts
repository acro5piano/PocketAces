import { BaseDirective } from './BaseDirective'
import { typeToTable } from 'src/database/Convension'
import { pick } from 'src/utils'
import { DirectiveExecutionChainable } from 'src/contracts/DirectiveContract'

export class WhereDirective extends BaseDirective<
  { table: string; keys?: string[] },
  {}
> {
  name = 'where'

  resolveField({ currentValue, resolveInfo }: DirectiveExecutionChainable) {
    const table = typeToTable(
      this.getDirectiveArgValue('table') as string,
      resolveInfo.returnType,
    )
    const keys = this.getDirectiveArgValue('keys') || ([] as string[])
    const where =
      keys.length > 0
        ? pick(this.getInputArgs() as any, ...keys)
        : (this.getInputArgs() as string)

    return this.queryChain(currentValue).table(table).where(where)
  }
}
