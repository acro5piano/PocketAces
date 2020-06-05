import { typeToTable } from 'src/database/Convension'
import { Directive } from 'src/contracts/DirectiveContract'

const find: Directive<{ table?: string }, { id: string }> = ({ args }) => ({
  resolveInfo,
  inputArgs,
  queryChain,
}) => {
  const table = typeToTable(args.table, resolveInfo.returnType)
  return queryChain.table(table).where({ id: inputArgs.id }).first()
}

export default find
