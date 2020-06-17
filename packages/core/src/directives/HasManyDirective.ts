// import { BaseDirective } from './BaseDirective'
// import { DirectiveExecutionArgs } from 'src/contracts/DirectiveContract'
// import { typeToTable, joinKeyFromTable } from 'src/database/Convension'
//
// export class HasManyDirective extends BaseDirective<{
//   table?: string
//   joins: string
// }> {
//   name = 'hasMany'
//
//   async resolveField({
//     parentValue,
//     resolveInfo,
//   }: DirectiveExecutionArgs<any, { id: string }>) {
//     const table = typeToTable(
//       this.getDirectiveArgValue('table'),
//       resolveInfo.returnType,
//     )
//
//     const joinKey =
//       this.getDirectiveArgValue('joins') ||
//       joinKeyFromTable(this.getParentTypeName())
//
//     const rows = this.loader.getLoader(table, joinKey).load(parentValue.id)
//     return rows
//   }
// }

import { joinKeyFromTable } from 'src/database/Convension'
import { DirectiveProps } from 'src/contracts/DirectiveContract'

export default function hasMany({
  inferredTableName,
  parentValue,
  args: { joins },
  loader,
  parent,
}: DirectiveProps<{ table?: string; joins?: string }>) {
  const joinKey = joins || joinKeyFromTable(parent.name.value)

  const rows = loader.getLoader(inferredTableName, joinKey).load(parentValue.id)
  return rows
}
