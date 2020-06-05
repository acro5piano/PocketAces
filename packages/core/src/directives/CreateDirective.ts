import { Directive } from 'src/contracts/DirectiveContract'
import { typeToTable } from 'src/database/Convension'

const create: Directive<{ table?: string }> = ({ args, db }) => async ({
  resolveInfo,
  inputArgs,
}) => {
  const table = typeToTable(args.table, resolveInfo.returnType)
  const [id] = await db(table).insert(inputArgs).returning('id')
  const record = await db(table).where({ id }).first()
  return record
}

export default create
