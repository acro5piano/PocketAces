import { omit } from 'src/utils'
import { DirectiveProps } from 'src/contracts/DirectiveContract'

export default function scope({
  queryChain,
  inferredTableName,
  args,
}: DirectiveProps<{ table?: string }>) {
  return queryChain.table(inferredTableName).where(omit(args, 'table'))
}
