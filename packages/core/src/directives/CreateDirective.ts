import { BaseDirective } from './BaseDirective'

export class CreateDirective extends BaseDirective {
  name = 'create'

  async resolveField() {
    const [id] = await this.database.db('users').insert(this.getInputArgs()).returning('id')
    const user = await this.database.db('users').where({ id }).first()
    return user
  }
}
