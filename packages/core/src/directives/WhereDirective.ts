import { typeToTable } from 'src/database/Convension'
import { pick } from 'src/utils'
import { Directive } from 'src/contracts/DirectiveContract'

const where: Directive<{ table: string; keys?: string[] }> = ({
  args,
  getQueryChain,
}) => ({ currentValue, resolveInfo, inputArgs }) => {
  const table = typeToTable(args.table, resolveInfo.returnType)
  const keys = args.keys || ([] as string[])
  const where = keys.length === 0 ? inputArgs : pick(inputArgs as any, ...keys)

  return getQueryChain(currentValue).table(table).where(where)
}

export default where
