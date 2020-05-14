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

  resolveField({ currentValue }: DirectiveExecutionArgs) {
    const eq = this.getDirectiveArgValue('eq')
    if (typeof eq === 'string') {
      return this.queryChain(currentValue).where(eq, this.getCurrentUser().uid)
    }

    const roles = this.getDirectiveArgValue('roles')
    if (Array.isArray(roles)) {
      if (!roles.includes(this.getCurrentUser().role)) {
        throw new Error('Not authorized to access this resource.')
      }
    }

    return currentValue
  }
}
