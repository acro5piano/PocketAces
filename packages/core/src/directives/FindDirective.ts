import { BaseDirective } from './BaseDirective'

export class FindDirective extends BaseDirective<{}, { id: string }> {
  name = 'find'

  resolveField() {
    return this.database.db
      .table('users')
      .where({ id: this.getInputArgValue('id') })
      .first()
  }
}
