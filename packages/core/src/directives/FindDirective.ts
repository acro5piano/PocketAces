import { BaseDirective } from './BaseDirective'

export class FindDirective extends BaseDirective<{ table: string }, { id: string }> {
  name = 'find'

  resolveField() {
    return this.database.db
      .table(this.getDirectiveArgValue('table'))
      .where({ id: this.getInputArgValue('id') })
      .first()
  }
}
