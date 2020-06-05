import { typeToTable } from 'src/database/Convension'
import { omit } from 'src/utils'
import { Directive } from 'src/contracts/DirectiveContract'

const scope: Directive<{ table?: string }> = ({ args, getQueryChain }) => ({
  resolveInfo,
  currentValue,
}) => {
  const table = typeToTable(args.table, resolveInfo.returnType)
  return getQueryChain(currentValue).table(table).where(omit(args, 'table'))
}

export default scope
