import { BaseDirective } from './BaseDirective'

export class WhereDirective extends BaseDirective<{ table: string }> {
  name = 'where'

  resolveField() {
    return this.database.db.table(this.getDirectiveArgValue('table'))
  }
}
