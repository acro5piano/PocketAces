import type { DirectiveProps } from '../contracts/DirectiveContract'

export default function can({
  currentValue,
  args: { eq, roles },
  queryChain,
  context,
}: DirectiveProps<{ eq?: string; roles?: string[]; cond?: string }>) {
  if (typeof eq === 'string') {
    return queryChain.where(eq, context.user.uid)
  }

  if (Array.isArray(roles)) {
    if (!roles.includes(context.user.role)) {
      throw new Error('Not authorized to access this resource.')
    }
  }

  return currentValue
}
