import { BaseDirective } from './BaseDirective'

export class AllDirective extends BaseDirective<{ table: string }> {
  name = 'all'

  async resolveField() {
    const rows = await this.database.db.table(this.getDirectiveArgValue('table'))
    return rows
  }
}
