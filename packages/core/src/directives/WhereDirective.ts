import { BaseDirective } from './BaseDirective'

export class WhereDirective extends BaseDirective<{ table: string; cond: object }> {
  name = 'where'

  resolveField() {
    return this.database.db
      .table(this.getDirectiveArgValue('table'))
      .where(this.getDirectiveArgValue('cond'))
  }
}
