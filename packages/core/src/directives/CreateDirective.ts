import { Container } from 'typedi'
import { DatabaseService } from 'src/services/DatabaseService'
import {
  DirectiveExecutionArgs,
  DirectiveParameters,
} from 'src/contracts/DirectiveContract'
import { typeToTable } from 'src/database/Convension'

const create = (init) => async ({
  resolveInfo,
  inputArgs,
}: DirectiveExecutionArgs & DirectiveParameters<any, any, any>) => {
  const db = Container.get(DatabaseService).db
  const table = typeToTable(init.table, resolveInfo.returnType)
  const [id] = await db(table).insert(inputArgs).returning('id')
  const record = await db(table).where({ id }).first()
  return record
}

export default create
