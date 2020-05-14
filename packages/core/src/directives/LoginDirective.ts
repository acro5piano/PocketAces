import { BaseDirective } from './BaseDirective'
import { DirectiveExecutionArgs } from 'src/contracts/DirectiveContract'
import { typeToTable } from 'src/database/Convension'
import * as Auth from 'src/auth/Auth'

export class LoginDirective extends BaseDirective<
  {
    table: string
    role?: string
    identify: string
    hashedColumn: string
    password: string
  },
  any
> {
  name = 'login'

  async resolveField({ resolveInfo }: DirectiveExecutionArgs) {
    const table = typeToTable(
      this.getDirectiveArgValue('table'),
      resolveInfo.returnType,
    )
    const invalidMessage = 'User not found, or password is invalid.'
    const idColumn = this.getDirectiveArgValue('identify') || 'email'
    const passwordColumn =
      this.getDirectiveArgValue('hashedColumn') || 'passwordHash'
    const user = await this.db
      .table(table)
      .where(idColumn, this.getInputArgValue(idColumn))
      .first()
    if (!user) {
      throw new Error(invalidMessage)
    }

    const passwordInput = this.getInputArgValue('password')
    if (!(await Auth.check(passwordInput, user[passwordColumn]))) {
      throw new Error(invalidMessage)
    }

    const { token, refreshToken } = await Auth.createTokens(
      user.id,
      this.getDirectiveArgValue('role') || null,
    )

    return { token, refreshToken }
  }
}
