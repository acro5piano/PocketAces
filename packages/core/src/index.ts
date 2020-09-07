import './bootstrap'
export { PocketAces } from './PocketAces'
export type Resolver<Args, Returns = any> = (
  root: unknown,
  ctx: unknown,
  args: Args,
) => Returns | Promise<Returns>
