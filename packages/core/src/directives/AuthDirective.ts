import { BaseDirective } from './BaseDirective'
import { DirectiveExecutionArgs } from 'src/contracts/DirectiveContract'
import { typeToTable } from 'src/database/Convension'

export class AuthDirective extends BaseDirective<{ table?: string }> {
  name = 'auth'

  resolveField({ resolveInfo }: DirectiveExecutionArgs) {
    const table = typeToTable(
      this.getDirectiveArgValue('table'),
      resolveInfo.returnType,
    )
    return this.db.table(table).where('id', this.getCurrentUser().uid).first()
  }
}
