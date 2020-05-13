import { BaseDirective } from './BaseDirective'
import { typeToTable } from 'src/database/Convension'
import { DirectiveExecutionChainable } from 'src/contracts/DirectiveContract'

export class FindDirective extends BaseDirective<
  { table: string },
  { id: string }
> {
  name = 'find'

  resolveField({ currentValue, resolveInfo }: DirectiveExecutionChainable) {
    const table = typeToTable(
      this.getDirectiveArgValue('table'),
      resolveInfo.returnType,
    )
    return this.queryChain(currentValue)
      .table(table)
      .where({ id: this.getInputArgValue('id') })
      .first()
  }
}
