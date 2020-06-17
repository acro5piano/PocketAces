import { pick } from 'src/utils'
import { DirectiveProps } from 'src/contracts/DirectiveContract'

export default async function update({
  inputArgs,
  queryChain,
  args: { keys },
}: DirectiveProps<{ table?: string; keys: string[] }, { id: string }>) {
  const _keys = keys || []

  console.log({ queryChain })

  await queryChain.clone().update(pick(inputArgs as any, ..._keys))

  return queryChain
}
