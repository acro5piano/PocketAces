import { BaseDirective } from './BaseDirective'
import { DirectiveExecutionChainable } from 'src/contracts/DirectiveContract'

export class FindDirective extends BaseDirective<{ table: string }, { id: string }> {
  name = 'find'

  resolveField({ currentValue }: DirectiveExecutionChainable) {
    if (currentValue) {
      return currentValue
        .table(this.getDirectiveArgValue('table'))
        .where({ id: this.getInputArgValue('id') })
        .first()
    }
    return this.database.db
      .table(this.getDirectiveArgValue('table'))
      .where({ id: this.getInputArgValue('id') })
      .first()
  }
}
