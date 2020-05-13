import { BaseDirective } from './BaseDirective'

export class WhereDirective extends BaseDirective {
  name = 'where'

  resolveField() {
    return this.database.db.table('users')
  }
}
