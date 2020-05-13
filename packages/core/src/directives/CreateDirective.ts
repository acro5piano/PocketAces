import { BaseDirective } from './BaseDirective'

export class CreateDirective extends BaseDirective<{ table: string }> {
  name = 'create'

  async resolveField() {
    const table = this.getDirectiveArgValue('table')
    const [id] = await this.database.db(table).insert(this.getInputArgs()).returning('id')
    const record = await this.database.db(table).where({ id }).first()
    return record
  }
}
