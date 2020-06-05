import { typeToTable } from 'src/database/Convension'
import { omit } from 'src/utils'
import { Directive } from 'src/contracts/DirectiveContract'

const scope: Directive<{ table?: string }> = ({ args }) => ({
  resolveInfo,
  queryChain,
}) => {
  const table = typeToTable(args.table, resolveInfo.returnType)
  return queryChain.table(table).where(omit(args, 'table'))
}

export default scope
