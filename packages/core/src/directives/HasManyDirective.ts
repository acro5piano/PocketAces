import { BaseDirective } from './BaseDirective'
import { DirectiveExecutionArgs } from 'src/contracts/DirectiveContract'

export class HasManyDirective extends BaseDirective<{ table: string; joins: string }> {
  name = 'hasMany'

  async resolveField({ parentValue }: DirectiveExecutionArgs<any, { id: string }>) {
    const rows = this.loader
      .getLoader(this.getDirectiveArgValue('table'), this.getDirectiveArgValue('joins'))
      .load(parentValue.id)
    return rows
  }
}
