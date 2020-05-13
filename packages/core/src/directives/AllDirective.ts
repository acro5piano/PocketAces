import { BaseDirective } from './BaseDirective'

export class AllDirective extends BaseDirective<{ table: string }> {
  name = 'all'

  resolveField() {
    return this.database.db.table(this.getDirectiveArgValue('table'))
  }
}
