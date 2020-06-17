import { DirectiveProps } from 'src/contracts/DirectiveContract'

export default async function all({
  inferredTableName,
  db,
}: DirectiveProps<{ table?: string }>) {
  return db.table(inferredTableName)
}
