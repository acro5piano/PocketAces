import { BaseDirective } from './BaseDirective'

export class AllDirective extends BaseDirective {
  name = 'all'

  resolveField() {
    return this.database.db.table('users')
  }
}
