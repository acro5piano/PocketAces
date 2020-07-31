import { DirectiveProps } from '../contracts/DirectiveContract'

export default async function log({
  currentValue,
  args: { message },
}: DirectiveProps<{ message?: string }>) {
  console.log(message || 'Hello!')

  return currentValue
}
