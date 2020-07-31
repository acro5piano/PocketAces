import type { DirectiveProps } from '../contracts/DirectiveContract'

export default async function all({
  inferredTableName,
  db,
}: DirectiveProps<{ table?: string }>) {
  return db.table(inferredTableName)
}
