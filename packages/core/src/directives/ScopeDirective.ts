import { omit } from '../utils'
import { DirectiveProps } from '../contracts/DirectiveContract'

export default function scope({
  queryChain,
  inferredTableName,
  args,
}: DirectiveProps<{ table?: string }>) {
  return queryChain.table(inferredTableName).where(omit(args, 'table'))
}
