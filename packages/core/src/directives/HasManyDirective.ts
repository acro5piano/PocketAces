import { joinKeyFromTable } from '../database/Convension'
import type { DirectiveProps } from '../contracts/DirectiveContract'

// TODO: currently happening N+1 problem!
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
