import { typeToTable } from 'src/database/Convension'
import { Directive } from 'src/contracts/DirectiveContract'

const find: Directive<{ table?: string }, { id: string }> = ({
  args,
  getQueryChain,
}) => ({ resolveInfo, currentValue, inputArgs }) => {
  const table = typeToTable(args.table, resolveInfo.returnType)
  return getQueryChain(currentValue)
    .table(table)
    .where({ id: inputArgs.id })
    .first()
}

export default find
