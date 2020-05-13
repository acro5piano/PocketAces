import { BaseDirective } from './BaseDirective'
import { DirectiveExecutionArgs } from 'src/contracts/DirectiveContract'

export class HasManyDirective extends BaseDirective<{ table: string; joins: string }> {
  name = 'hasMany'

  async resolveField({ parentValue }: DirectiveExecutionArgs<any, { id: string }>) {
    const rows = await this.database.db
      .table(this.getDirectiveArgValue('table'))
      .where({ [this.getDirectiveArgValue('joins')]: parentValue.id })
    return rows
  }
}
