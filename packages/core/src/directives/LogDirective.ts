import { DirectiveProps } from 'src/contracts/DirectiveContract'

export default async function log({
  currentValue,
  args: { message },
}: DirectiveProps<{ message?: string }>) {
  console.log(message || 'Hello!')

  return currentValue
}
