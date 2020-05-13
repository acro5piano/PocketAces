import { BaseDirective } from './BaseDirective'
import { DirectiveExecutionChainable } from 'src/contracts/DirectiveContract'
import { omit } from 'src/utils'

export class ScopeDirective extends BaseDirective<{ table: string; [k: string]: any }, {}> {
  name = 'scope'

  resolveField({ currentValue }: DirectiveExecutionChainable) {
    const table = this.getDirectiveArgValue('table') as string
    const where = omit(this.getDirectiveArgs(), 'table')

    if (currentValue) {
      return currentValue.table(table).where(where)
    }

    return this.database.db.table(table).where(where)
  }
}
