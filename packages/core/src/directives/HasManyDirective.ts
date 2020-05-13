import { BaseDirective } from './BaseDirective'
import { DirectiveExecutionArgs } from 'src/contracts/DirectiveContract'
import { typeToTable, joinKeyFromTable } from 'src/database/Convension'

export class HasManyDirective extends BaseDirective<{
  table?: string
  joins: string
}> {
  name = 'hasMany'

  async resolveField({
    parentValue,
    resolveInfo,
  }: DirectiveExecutionArgs<any, { id: string }>) {
    const table = typeToTable(
      this.getDirectiveArgValue('table'),
      resolveInfo.returnType,
    )

    const joinKey =
      this.getDirectiveArgValue('joins') ||
      joinKeyFromTable(this.getParentTypeName())

    const rows = this.loader.getLoader(table, joinKey).load(parentValue.id)
    return rows
  }
}
