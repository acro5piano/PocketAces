import { Container } from 'typedi'
import { DatabaseService } from 'src/services/DatabaseService'
import { Directive } from 'src/contracts/DirectiveContract'
import { typeToTable } from 'src/database/Convension'

const create: Directive<{ table?: string }> = (init) => async ({
  resolveInfo,
  inputArgs,
}) => {
  const db = Container.get(DatabaseService).db
  const table = typeToTable(init.args.table, resolveInfo.returnType)
  const [id] = await db(table).insert(inputArgs).returning('id')
  const record = await db(table).where({ id }).first()
  return record
}

export default create
