import type { DirectiveProps } from '../contracts/DirectiveContract'

export default async function create({
  db,
  inputArgs,
  inferredTableName,
}: DirectiveProps<{ table?: string }>) {
  const [id] = await db(inferredTableName).insert(inputArgs).returning('id')
  const record = await db(inferredTableName).where({ id }).first()
  return record
}
