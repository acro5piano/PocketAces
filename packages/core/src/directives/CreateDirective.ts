import { BaseDirective } from './BaseDirective'
import { DirectiveExecutionArgs } from 'src/contracts/DirectiveContract'
import { typeToTable } from 'src/database/Convension'

export class CreateDirective extends BaseDirective<{ table?: string }> {
  name = 'create'

  async resolveField({ resolveInfo }: DirectiveExecutionArgs) {
    const table = typeToTable(
      this.getDirectiveArgValue('table'),
      resolveInfo.returnType,
    )
    const [id] = await this.db(table)
      .insert(this.getInputArgs())
      .returning('id')
    const record = await this.db(table).where({ id }).first()
    return record
  }
}
