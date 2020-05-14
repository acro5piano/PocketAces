import { BaseDirective } from './BaseDirective'
import { DirectiveExecutionArgs } from 'src/contracts/DirectiveContract'
// import { typeToTable } from 'src/database/Convension'
// import * as Auth from 'src/auth/Auth'

export class CanDirective extends BaseDirective<{
  eq?: string
  roles?: string[]
  cond?: string
}> {
  name = 'can'

  resolveField({ currentValue, resolveInfo }: DirectiveExecutionArgs) {
    return currentValue
  }
}
