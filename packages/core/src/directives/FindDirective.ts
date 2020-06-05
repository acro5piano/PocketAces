import { Container } from 'typedi'
import { DatabaseService } from 'src/services/DatabaseService'
import Knex from 'knex'
import { typeToTable } from 'src/database/Convension'
import { Directive } from 'src/contracts/DirectiveContract'

function queryChain(currentValue: any) {
  if (currentValue) {
    return currentValue
  }
  const db = Container.get(DatabaseService).db
  return (db as any) as Knex.QueryBuilder
}

const find: Directive<{ table?: string }, { id: string }> = (init) => ({
  resolveInfo,
  currentValue,
  inputArgs,
}) => {
  const table = typeToTable(init.args.table, resolveInfo.returnType)
  return queryChain(currentValue)
    .table(table)
    .where({ id: inputArgs.id })
    .first()
}

export default find
