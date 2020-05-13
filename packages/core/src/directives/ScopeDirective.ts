import { BaseDirective } from './BaseDirective'
import { typeToTable } from 'src/database/Convension'
import { DirectiveExecutionChainable } from 'src/contracts/DirectiveContract'
import { omit } from 'src/utils'

export class ScopeDirective extends BaseDirective<
  { table: string; [k: string]: any },
  {}
> {
  name = 'scope'

  resolveField({ currentValue, resolveInfo }: DirectiveExecutionChainable) {
    const table = typeToTable(
      this.getDirectiveArgValue('table'),
      resolveInfo.returnType,
    )
    return this.queryChain(currentValue)
      .table(table)
      .where(omit(this.getDirectiveArgs(), 'table'))
  }
}
