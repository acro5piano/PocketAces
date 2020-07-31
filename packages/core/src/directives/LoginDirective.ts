import * as Auth from '../auth/Auth'

import type { DirectiveProps } from '../contracts/DirectiveContract'

interface DirectiveArgs {
  table: string
  identity: string
  hashedColumn: string
  password: string
  role?: string
}

export default async function login({
  inputArgs,
  db,
  inferredTableName,
  args,
}: DirectiveProps<DirectiveArgs>) {
  const invalidMessage = 'User not found, or password is invalid.'
  const idColumn = args.identity || 'email'
  const passwordColumn = args.hashedColumn || 'passwordHash'
  const user = await db
    .table(inferredTableName)
    .where(idColumn, inputArgs[idColumn])
    .first()
  if (!user) {
    throw new Error(invalidMessage)
  }

  const passwordInput = inputArgs.password
  if (!(await Auth.check(passwordInput, user[passwordColumn]))) {
    throw new Error(invalidMessage)
  }

  const { token, refreshToken } = await Auth.createTokens(
    user.id,
    args.role || null,
  )

  return { token, refreshToken }
}
