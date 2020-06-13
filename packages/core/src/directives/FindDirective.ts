import { DirectiveProps } from 'src/contracts/DirectiveContract'

export default async function find({
  inputArgs,
  queryChain,
  inferredTableName,
}: DirectiveProps<{ table?: string }, { id: string }>) {
  return queryChain.table(inferredTableName).where({ id: inputArgs.id }).first()
}
