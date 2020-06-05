import { Directive } from 'src/contracts/DirectiveContract'
import { typeToTable } from 'src/database/Convension'

const all: Directive<{ table?: string }> = ({ args, db }) => ({
  resolveInfo,
}) => {
  const table = typeToTable(args.table, resolveInfo.returnType)
  return db.table(table)
}

export default all
