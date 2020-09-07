import './bootstrap'
export { PocketAces } from './PocketAces'
import { GraphQLResolveInfo, GraphQLInterfaceType } from 'graphql'

export type Resolver<Args, Returns = any> = (
  root: unknown,
  args: Args,
  ctx: unknown,
  info: GraphQLResolveInfo & GraphQLInterfaceType,
) => Returns | Promise<Returns>
